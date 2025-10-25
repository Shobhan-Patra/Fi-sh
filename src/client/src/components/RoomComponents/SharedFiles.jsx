import { Download } from 'lucide-react';

function UploadingFileItem({ file }) {
  return (
    <div className="bg-gray-800 rounded-xl p-4 space-y-2">
      <div className="flex justify-between items-center text-sm">
        <p className="font-medium text-white truncate">{file.name}</p>
        <p
          className={`font-semibold ${file.error ? 'text-red-400' : 'text-indigo-300'}`}
        >
          {file.error ? 'Failed' : `${file.progress}%`}
        </p>
      </div>
      {/* The visual progress bar */}
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-indigo-500 h-2 rounded-full transition-all duration-150"
          style={{ width: `${file.progress}%` }}
        ></div>
      </div>
    </div>
  );
}

export default function SharedFiles({ sharedFiles, uploadingFiles }) {
  // console.log('Files inside uploadingFiles : ', uploadingFiles);

  if (
    (!Array.isArray(sharedFiles) || sharedFiles.length === 0) &&
    uploadingFiles.length === 0
  ) {
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
        {/* Render the list of files currently uploading */}
        {uploadingFiles.map((file) => (
          <UploadingFileItem key={file.id} file={file} />
        ))}

        {sharedFiles.map((file) => (
          <div
            key={file.id}
            className="flex justify-between items-center bg-gray-800 rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <div>
              <p className="font-medium">{file.file_name}</p>
              <p className="text-sm text-gray-400">
                {file.file_size} • Uploaded at{' '}
                {new Date(file.uploaded_at + 'Z').toLocaleString()}
              </p>
            </div>
            <a
              href={file.storage_url}
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
