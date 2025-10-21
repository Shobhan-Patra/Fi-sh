import axios from 'axios';
import { filesize } from 'filesize';
import CardParticipantsList from '../components/RoomComponents/ParticipantsList';
import UploadDropBox from '../components/RoomComponents/UploadDropBox';
import SharedFiles from '../components/RoomComponents/SharedFiles';
import RoomId from '../components/RoomComponents/RoomId';
import getDownloadUrl from '../utils/getDownloadUrl.js';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import ErrorToast from '../components/Common/ErrorToast.jsx';
import NotificationToast from '../components/Common/NotificationToast.jsx';
import { socket } from '../socket.js';
import truncateString from '../utils/truncateString.js';

const MAX_SIZE_FILE_LIMIT = 100 * 1024 * 1024; // 100MB

export default function Room({ currentUser }) {
  const [sharedFiles, setSharedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roomParticipants, setRoomParticipants] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');
  const { roomId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // console.log(currentUser);
    if (!roomId) {
      return;
    }
    if (!sessionStorage.getItem('user')) {
      // console.log('No saved user found, redirecting to join room page');
      navigate('/join-room', {
        replace: true, // Replaces the history entry, so the user can't click "back" into this redirect loop.
        state: { roomId: roomId },
      });
    }
    if (roomId && currentUser) {
      const getAllData = async () => {
        try {
          setError('');
          setIsLoading(true);
          const result = await axios.get(
            `/api/file/data/${roomId}/${currentUser?.id}`
          );
          setSharedFiles(result.data.data.fileData);
          setRoomParticipants(result.data.data.participants);
        } catch (error) {
          setError("Couldn't load room data, Please refresh the page");
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      };
      getAllData();
    }
  }, [roomId, currentUser, navigate]);

  useEffect(() => {
    if (roomId && currentUser) {
      socket.emit('room:join', {
        roomId: roomId,
        userId: currentUser.id,
        display_name: currentUser.display_name,
      });
    }

    const handleUserJoinEvent = ({ user }) => {
      console.log(`User: ${user.id} joined`);
      setRoomParticipants((prevParticipants) => {
        const userExists = prevParticipants.some(
          (participant) => participant.id === user.id
        );

        if (userExists) return prevParticipants;
        else return [...prevParticipants, user];
      });
      setNotification(`${user.display_name} joined the room`);
    };

    const handleUserLeaveEvent = ({ userId, display_name }) => {
      console.log(`User: ${userId} left`);
      setRoomParticipants((prevParticipants) => {
        return prevParticipants.filter(
          (participant) => participant.id !== userId
        );
      });
      setNotification(`${display_name} left the room`);
    };

    const handleFileUpload = ({ fileData, display_name }) => {
      console.log('File uploaded: ', fileData, display_name);
      setSharedFiles((prevFiles) => [...prevFiles, fileData]);
      const truncatedFileName = truncateString(fileData.file_name);
      setNotification(`${display_name} uploaded ${truncatedFileName}`);
    };

    socket.on('user-joined', handleUserJoinEvent);
    socket.on('user-left', handleUserLeaveEvent);
    socket.on('file:upload', handleFileUpload);

    return () => {
      console.log('Cleaning up room event listeners...');
      socket.off('user-joined', handleUserJoinEvent);
      socket.off('user-left', handleUserLeaveEvent);
      socket.off('file:upload', handleFileUpload);
    };
  }, [roomId, currentUser, sharedFiles]);

  useEffect(() => {
    if (error || notification) {
      const timer = setTimeout(() => {
        setError('');
        setNotification('');
        setIsLoading(false);
      }, 3 * 1000);
      return () => clearTimeout(timer);
    }
  }, [error, notification]);

  async function uploadFile(file) {
    const fileData = {
      roomId: roomId,
      userId: currentUser.id,
      filename: file.name,
      fileSize: filesize(parseInt(file.size)),
      contentType: file.type,
      downloadUrl: '',
    };

    const uploadId = `${file.name}-${file.lastModified}`;
    setUploadingFiles((prev) => [
      ...prev,
      { id: uploadId, name: file.name, progress: 0 },
    ]);

    // Get upload URL
    const { data } = await axios.post('/api/file/upload', {
      filename: fileData.filename,
      filesize: fileData.fileSize,
      contentType: fileData.contentType,
    });

    const signedUploadUrl = data.data.signedUploadUrl;
    const key = data.data.key;
    try {
      if (!signedUploadUrl) throw new Error('Error fetching upload Url');

      // Upload the file on the fetched URL
      await axios.put(signedUploadUrl, file, {
        headers: {
          'Content-Type': file.type,
          'Content-Disposition': 'attachment',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(uploadingFiles);
          setUploadingFiles((prev) => {
            // Use a function-based approach to get the latest state
            return prev.map((f) =>
              f.id === uploadId ? { ...f, progress: percentCompleted } : f
            );
          });
        },
      });

      // update local fileData
      fileData.downloadUrl = await getDownloadUrl(key, fileData.filename);

      // update files table
      const { data } = await axios.post('/api/file/update', fileData, {
        headers: {
          'X-Socket-Id': socket.id,
        },
      });
      console.log(data);

      // Update sharedFiles after uploading a file
      setSharedFiles((prevFiles) => [...prevFiles, data.data]);
    } catch (error) {
      setError('Error uploading file, Please retry later');
      console.log(error);
      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.id === uploadId
            ? { ...f, progress: 100, error: 'Upload failed' }
            : f
        )
      );
    } finally {
      setUploadingFiles((prev) => prev.filter((f) => f.id !== uploadId));
    }
  }

  const handleFiles = (files) => {
    setError('');

    const validFiles = [];
    const oversizedFiles = [];

    Array.from(files).forEach((file) => {
      if (file.size > MAX_SIZE_FILE_LIMIT) {
        oversizedFiles.push(file);
      } else {
        validFiles.push(file);
      }
    });

    if (oversizedFiles.length > 0) {
      const oversizedFileNames = oversizedFiles.map((f) => f.name).join(', ');
      const truncatedFileName = truncateString(oversizedFileNames);
      setError(
        `The following files are too large (max 100 MB): ${truncatedFileName}`
      );
    }

    if (validFiles.length > 0) {
      validFiles.forEach((file) => {
        uploadFile(file);
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="flex items-center space-x-4">
          {/* The spinning loader icon */}
          <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
          <span className="text-2xl font-medium text-gray-300">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen flex flex-col items-center bg-gray-900 text-white px-6 py-12">
      <RoomId roomId={roomId} />
      <UploadDropBox handleFiles={handleFiles} />
      <ErrorToast message={error} onClose={() => setError(null)} />
      <NotificationToast
        message={notification}
        onClose={() => setNotification('')}
      />
      <SharedFiles sharedFiles={sharedFiles} uploadingFiles={uploadingFiles} />
      <CardParticipantsList
        participants={roomParticipants}
        currentUser={currentUser}
      />
    </section>
  );
}
