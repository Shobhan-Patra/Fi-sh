import { Upload } from "lucide-react";
import { useRef, useState } from "react";

export default function UploadDropBox ({ handleFiles }) {
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };
    
    return (<>
        <div className="w-full max-w-3xl mb-16">
        <div
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition cursor-pointer
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
          <button className="px-6 py-3 bg-indigo-600 text-white cursor-pointer font-semibold rounded-xl shadow hover:bg-indigo-700 transition">
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
      </>
    );
}