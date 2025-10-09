import axios from "axios";
import {filesize} from "filesize";
import CardParticipantsList from "../components/RoomComponents/ParticipantsList";
import UploadDropBox from "../components/RoomComponents/UploadDropBox";
import SharedFiles from "../components/RoomComponents/SharedFiles";
import RoomId from "../components/RoomComponents/RoomId";
import getDownloadUrl from "../utils/getDownloadUrl.js";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function Room({ currentUser }) {
  // const [roomId, setRoomId] = useState("");
  const [sharedFiles, setSharedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roomParticipants, setRoomParticipants] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const { roomId } = useParams();

  useEffect(() => {
    if (!roomId) {
      return;
    }
    const getAllData = async () => {
      try {
        setIsLoading(true);
        // const result = await axios.get(`/api/file/data/${roomId}`);
        const result = await axios.get(`/api/file/data/${roomId}`);
        setSharedFiles(result.data.data.fileData);
        setRoomParticipants(result.data.data.participants);
      } catch (error) {
        console.log(error);
        return;
      } finally {
        setIsLoading(false);
      }
    };
    getAllData();
  }, [roomId]);

  async function uploadFile(file) {
    const fileData = {
      roomId: roomId,
      userId: currentUser.id,
      filename: file.name,
      fileSize: filesize(parseInt(file.size)),
      contentType: file.type,
      downloadUrl: "",
    };

    const uploadId = `${file.name}-${file.lastModified}`;
    setUploadingFiles(prev => [...prev, { id: uploadId, name: file.name, progress: 0 }]);

    // Get upload URL
    const { data } = await axios.post("/api/file/upload", {
      filename: fileData.filename,
      contentType: fileData.contentType,
    });
    console.log("Data: ", data);

    const signedUploadUrl = data.data.signedUploadUrl;
    const key = data.data.key;

    try {
      if (!signedUploadUrl) throw new Error("Error fetching upload Url");

      // Upload the file on the fetched URL
      const uploadResult = await axios.put(signedUploadUrl, file, {
        headers: {
          "Content-Type": file.type,
          "Content-Disposition": "attachment",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadingFiles(prev => 
            prev.map(f => f.id === uploadId ? { ...f, progress: percentCompleted } : f)
          );
        },
      });
      console.log("Upload successful: ", uploadResult);

      // update local fileData
      fileData.downloadUrl = await getDownloadUrl(key, fileData.filename);

      // update files table
      await axios.post("/api/file/update", fileData);

      // Update Shared files list
      // const files = await axios.get(`/api/file/all/${roomId}`);
      const files = await axios.get(`/api/file/data/${roomId}`);
      console.log("Files before updating state: ", files);
      setSharedFiles(files.data.data.fileData);
      setRoomParticipants(files.data.data.participants);
    } catch (error) {
      console.log(error);
    }
    finally {
      setUploadingFiles(prev => prev.filter(f => f.id !== uploadId));
    }
  }

  const handleFiles = (files) => {
    console.log("Selected files:", files);
    Array.from(files).forEach((file) => {
      uploadFile(file);
    });
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
      <SharedFiles sharedFiles={sharedFiles} uploadingFiles={uploadingFiles}/>
      <CardParticipantsList
        participants={roomParticipants}
        currentUser={currentUser}
      />
    </section>
  );
}
