import { useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function JoinRoom({ onJoinRoom }) {
  const location = useLocation();
  const [roomId, setRoomId] = useState(location.state?.roomId || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (roomId.length !== 6) {
      setError('Please enter a valid Room Id');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await onJoinRoom(roomId);
    } catch (error) {
      setError('Failed to join room. Please check the ID.');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center text-gray-100">
      <h2 className="text-4xl font-bold text-indigo-400">Join a Room</h2>
      <p className="mt-4 text-gray-300">
        Got a link or room code? Enter it below to access shared files.
      </p>

      {/* Container for the form elements */}
      <div className="mt-12 flex flex-col items-center">
        {/* Sub-container for the inline input and button */}
        <div className="flex flex-row items-center space-x-4">
          <input
            type="text"
            placeholder="A1B2C3"
            value={roomId}
            maxLength={6}
            onChange={(e) =>
              setRoomId(e.target.value.toUpperCase().slice(0, 6))
            }
            className="w-50 text-3xl bg-gray-800 px-6 py-3 rounded-xl shadow-lg border border-gray-700 text-center font-mono tracking-[.15em] text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500 transition"
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-8 py-4 bg-indigo-500 text-white rounded-xl text-lg font-medium hover:bg-indigo-600 shadow-lg transition disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Joining...' : 'Join'}
          </button>
        </div>
        {error && <p className="text-red-400 mt-4">{error}</p>}
      </div>
    </div>
  );
}
