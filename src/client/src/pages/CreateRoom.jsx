import { Link } from "react-router-dom";

export default function CreateRoom() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center text-gray-100">
      <h2 className="text-4xl font-bold text-indigo-400">Create a Room</h2>
      <p className="mt-4 text-gray-300">
        Generate a private room to start sharing files. Each room gets a unique
        link you can share securely.
      </p>
      <Link to="/room" className="">
        <button className="mt-8 px-8 py-4 bg-indigo-500 text-white rounded-xl text-lg font-medium hover:bg-indigo-600 shadow-lg transition">
          Generate Room Link
        </button>
      </Link>
    </div>
  );
}
