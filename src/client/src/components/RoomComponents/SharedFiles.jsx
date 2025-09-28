import { Download } from "lucide-react";

export default function SharedFiles({ sharedFiles }) {
    return (
        <div className="w-full max-w-3xl">
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
    );
}