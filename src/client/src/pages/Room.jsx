// import { filesize } from "filesize";
import axios from "axios";
// import getDownloadUrl from "../utils/getDownloadUrl";
import CardParticipantsList from "../components/RoomComponents/ParticipantsList";
import UploadDropBox from "../components/RoomComponents/UploadDropBox";
import SharedFiles from "../components/RoomComponents/SharedFiles";
import RoomId from "../components/RoomComponents/RoomId";

export default function Room({ currentUser, sharedFiles, participants }) { 
  async function uploadFile(file) {
    // Get upload URL
    const fileData = {
      filename: file.name,
      contentType: file.type,
    };

    const { data } = await axios.post("/api/file/upload", fileData);
    console.log(data);

    console.log("Data: ", data);
    const signedUploadUrl = data.data.signedUploadUrl;
    // const key = data.data.key;

    try {
      if (!signedUploadUrl) throw new Error("Error fetching upload Url");

      // Upload the file on the fetched URL
      const uploadRes = await fetch(signedUploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
          "Content-Disposition": `attachment"`,
        },
      });

      console.log("Upload Res: ", uploadRes);

      if (!uploadRes.ok) {
        const text = await uploadRes.text(); // read error XML
        throw new Error(`Upload failed: ${uploadRes.status} - ${text}`);
      }

      console.log("Upload successful");

      // Get download Url
      // const downloadUrl = await getDownloadUrl(key);

      // TODO:
      //   // update files table
      //   const res = await fetch("http://localhost:8000/api/file/update", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     filename: file.name,
      //     contentType: file.type,
      //   }),
      // });

      //Update Shared files list
      // updateSharedFiles(file.name, key, file.size, downloadUrl);
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
      < UploadDropBox handleFiles={handleFiles}/>
      <SharedFiles sharedFiles={sharedFiles} />
      <CardParticipantsList participants={participants} currentUser={currentUser} />
    </section>
  );
}
