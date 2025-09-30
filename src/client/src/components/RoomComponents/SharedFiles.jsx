import { Download } from "lucide-react";

export default function SharedFiles({ sharedFiles }) {
  console.log("Files inside sharedFiles component: ", sharedFiles);

  if (!Array.isArray(sharedFiles) || sharedFiles.length === 0) {
    return (
      <div className="w-full max-w-3xl">
        <h3 className="text-2xl font-bold mb-6 text-indigo-400">
          Shared Files
        </h3>
        <div className="bg-gray-800 rounded-xl p-6 text-center text-gray-400">
          <p>No files have been shared in this room yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl">
      <h3 className="text-2xl font-bold mb-6 text-indigo-400">Shared Files</h3>
      <div className="space-y-4">
        {sharedFiles.map((file) => (
          <div
          key={file.id}
          className="flex justify-between items-center bg-gray-800 rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <div>
              <p className="font-medium">{file.file_name}</p>
              <p className="text-sm text-gray-400">
                {file.file_size} • Uploaded at {new Date(file.uploaded_at + "Z").toLocaleString()}
              </p>
            </div>
            <a
              href={file.storage_url}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
              >
              <Download size={18} />
              <span>Download</span>
            </a>
              {console.log("File inside the element: ", file)}
          </div>
        ))}
      </div>
    </div>
  );
}
