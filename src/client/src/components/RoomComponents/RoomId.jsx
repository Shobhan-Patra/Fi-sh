// import { useEffect, useState } from "react";

export default function RoomId({ roomId }) {
  // const [roomId, setRoomId] = useState("");
  // useEffect(() => {
  //   const savedRoomId = sessionStorage.getItem("roomId");
  //   if (savedRoomId) {
  //     setRoomId(savedRoomId);
  //   }
  // }, []);
  
  console.log(roomId);

  if (!roomId) {
    return (
      <div className="mb-12 text-center animate-pulse">
        <h2 className="text-3xl font-extrabold text-indigo-400 mb-4">Room ID</h2>
        <code className="text-3xl bg-gray-700 px-6 py-3 rounded-xl shadow-lg">
          LOADING...
        </code>
        <p className="text-gray-400 mt-3">Waiting for room information</p>
      </div>
    );
  }
  
  return (
    <div className="mb-12 text-center">
      <h2 className="text-3xl font-extrabold text-indigo-400 mb-4">Room ID</h2>
      <code className="text-3xl bg-gray-800 px-6 py-3 rounded-xl shadow-lg border border-indigo-600 tracking-[.15em]">
        {roomId}
      </code>
      <p className="text-gray-400 mt-3">Share this ID with others to join</p>
    </div>
  );
}
