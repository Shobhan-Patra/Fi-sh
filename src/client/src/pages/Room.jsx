import { Upload, Download } from "lucide-react";
import { useRef, useState } from "react";
import { filesize } from "filesize";

export default function Room() {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [sharedFiles, setSharedFiles] = useState([
    {
      name: "example.txt",
      key: "",
      size: "2.1 MB",
      uploadedAt: new Date().toLocaleDateString(),
      url: "",
    },
  ]);

  async function uploadFile(file) {
    // Get upload URL
    // const res = await fetch("/api/v1/file/upload", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     filename: file.name,
    //     contentType: file.type,
    //   }),
    // });
    // const data = await res.json();

    const fileData = {
      filename: file.name,
      contentType: file.type,
    };

    const { data } = await axios.post("/api/v1/file/upload", fileData);
    console.log(data);

    // const data = response;

    console.log("Data: ", data?.data);
    const signedUploadUrl = data.signedUploadUrl;
    const key = data.key;

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
      const downloadUrl = await getDownloadUrl(key);

      // TODO:
      //   // update files table
      //   const res = await fetch("http://localhost:8000/api/v1/file/update", {
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
      updateSharedFiles(file.name, key, file.size, downloadUrl);
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

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const updateSharedFiles = (fileName, key, fileSize, url) => {
    setSharedFiles((prevFiles) => [
      ...prevFiles,
      {
        name: fileName,
        key,
        size: filesize(parseInt(fileSize)),
        uploadedAt: new Date().toLocaleDateString(),
        url,
      },
    ]);
  };

  async function getDownloadUrl(key) {
    try {
      // const res = await fetch(
      //   `/api/v1/download?key=${encodeURIComponent(key)}`
      // );
      // const { data } = await res.json();

      const { data } = await axios.get(
        `/api/v1/download?key=${encodeURIComponent(key)}`
      );

      if (!data?.signedDownloadUrl) {
        throw new Error("Backend did not return a signed download URL");
      }

      console.log("Download URL Result:", data.signedDownloadUrl);

      return data.signedDownloadUrl;

      // if (!res.ok) {
      //   const text = await res.text(); // read error as text (might be HTML/XML)
      //   throw new Error(`Failed to get download URL: ${res.status} - ${text}`);
      // }
    } catch (err) {
      console.error("Error in fetching download URL:", err);
      throw err;
    }
  }

  return (
    <section className="min-h-screen flex flex-col items-center bg-gray-900 text-white px-6 py-12">
      {/* Room ID */}
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-extrabold text-indigo-400 mb-4">
          Room ID
        </h2>
        <code className="text-3xl bg-gray-800 px-6 py-3 rounded-xl shadow-lg border border-indigo-600 tracking-[.15em]">
          A1B2C3
        </code>
        <p className="text-gray-400 mt-3">Share this ID with others to join</p>
      </div>
      {/* Upload Dropbox */}
      <div className="w-full max-w-3xl mb-16">
        <div
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition
        ${
          dragActive
            ? "border-indigo-400 bg-gray-800"
            : "border-gray-500 bg-gray-900"
        }`}
          onDragEnter={() => setDragActive(true)}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <Upload className="mx-auto mb-4 text-indigo-400" size={48} />
          <p className="text-lg font-medium mb-2">
            Drag & drop your files here
          </p>
          <p className="text-gray-400 mb-4">or click to select files</p>
          <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow hover:bg-indigo-700 transition">
            Upload File
          </button>
        </div>
      </div>
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {/* Shared Files Section */}
      <div className="w-full max-w-4xl">
        <h3 className="text-2xl font-bold mb-6 text-indigo-400">
          Shared Files
        </h3>
        <div className="space-y-4">
          {sharedFiles.map((file) => (
            <div
              key={file.key}
              className="flex justify-between items-center bg-gray-800 rounded-xl p-4 shadow hover:shadow-lg transition"
            >
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-400">
                  {file.size} • Uploaded at {file.uploadedAt}
                </p>
              </div>
              <a
                href={file.url}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
              >
                <Download size={18} />
                <span>Download</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
