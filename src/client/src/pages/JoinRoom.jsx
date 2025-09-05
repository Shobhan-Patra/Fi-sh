import { Link } from "react-router-dom"

export default function JoinRoom() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center text-gray-100">
      <h2 className="text-4xl font-bold text-indigo-400">Join a Room</h2>
      <p className="mt-4 text-gray-300">
        Got a link or room code? Enter it below to access shared files.
      </p>

      <div className="mt-8 flex justify-center space-x-3">
        <input
          type="text"
          placeholder="Enter Room Code"
          className="p-3 bg-gray-800 border border-gray-700 rounded-lg w-64 text-center text-gray-100 placeholder-gray-400 focus:outline-none focus:ring focus:ring-indigo-500"
        />
        <Link to="/room" className="flex items-center space-x-2">
          <button className="px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition">
            Join
          </button>
        </Link>
      </div>
    </div>
  );
}
