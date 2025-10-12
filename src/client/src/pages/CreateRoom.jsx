import { Loader2 } from 'lucide-react';

export default function CreateRoom({ onCreateRoom, isLoading }) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center text-gray-100">
      <h2 className="text-4xl font-bold text-indigo-400">Create a Room</h2>
      <p className="mt-4 text-gray-300">
        Generate a private room to start sharing files. Each room gets a unique
        link you can share securely.
      </p>
      <button
        className="mt-8 px-8 py-4 bg-indigo-500 text-white rounded-xl text-lg font-medium hover:bg-indigo-600 shadow-lg transition"
        onClick={onCreateRoom}
      >
        {isLoading ? (
          <>
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
              <span className="font-medium text-gray-300">Loading...</span>
            </div>
          </>
        ) : (
          <>Generate Room Link</>
        )}
      </button>
    </div>
  );
}
