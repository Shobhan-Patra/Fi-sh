import axios from "axios";
import { filesize } from "filesize";
import CardParticipantsList from "../components/RoomComponents/ParticipantsList";
import UploadDropBox from "../components/RoomComponents/UploadDropBox";
import SharedFiles from "../components/RoomComponents/SharedFiles";
import RoomId from "../components/RoomComponents/RoomId";
import getDownloadUrl from "../utils/getDownloadUrl.js";
import { useEffect, useState } from "react";

export default function Room({ currentUser, sharedFiles, onFileUpload,  participants }) {
  const [roomId, setRoomId] = useState("");
  useEffect(() => {
    const savedRoomId = sessionStorage.getItem("roomId");
    if (savedRoomId) {
      setRoomId(savedRoomId);
    }
  }, []);

  async function uploadFile(file) {
    const fileData = {
      roomId: roomId,
      userId: currentUser.id,
      filename: file.name,
      fileSize: filesize(parseInt(file.size)),
      contentType: file.type,
      downloadUrl: "",
    };

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
      });
      console.log("Upload successful: ", uploadResult);


      const downloadUrl = await getDownloadUrl(key);

      // update local fileData
      fileData.downloadUrl = downloadUrl;

      // update files table
      await axios.post("/api/file/update", fileData);

      // Update Shared files list
      const files = await axios.get(`/api/file/all/${roomId}`);
      console.log("Files before updating state: ", files);
      onFileUpload(files.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleFiles = (files) => {
    console.log("Selected files:", files);
    Array.from(files).forEach((file) => {
      uploadFile(file);
    });
  };

  // const updateSharedFiles = (fileName, key, fileSize, url) => {
  //   setSharedFiles((prevFiles) => [
  //     ...prevFiles,
  //     {
  //       name: fileName,
  //       key,
  //       size: filesize(parseInt(fileSize)),
  //       uploadedAt: new Date().toLocaleDateString(),
  //       url,
  //     },
  //   ]);
  // };

  return (
    <section className="min-h-screen flex flex-col items-center bg-gray-900 text-white px-6 py-12">
      <RoomId />
      <UploadDropBox handleFiles={handleFiles} />
      <SharedFiles sharedFiles={sharedFiles} />
      <CardParticipantsList
        participants={participants}
        currentUser={currentUser}
      />
    </section>
  );
}
