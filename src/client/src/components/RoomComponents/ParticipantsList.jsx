export default function CardParticipantsList({ participants, currentUser }) {
  console.log(participants, currentUser);
  if (!participants || !currentUser) {
    return (
      <div className="w-full max-w-3xl mx-auto my-14">
      <h3 className="text-2xl font-bold mb-4 text-indigo-400">
        Participants
      </h3>
      <div className="bg-gray-800 rounded-xl p-6 text-center text-gray-400">
        <p>You are the only one in the room. Share the code to invite others!</p>
      </div>
    </div>
    );
  }
  return (
    <div className="w-full max-w-3xl mx-auto my-14">
      <h3 className="text-2xl font-bold mb-4 text-indigo-400">
        Participants
      </h3>
      <div className="rounded-xl p-4 space-y-3 shadow-lg">
        {participants.map((p) => (
          <div
            key={p.id}
            // Add a subtle highlight for the current user
            className={`flex items-center space-x-3 p-2 rounded-lg ${
              p.id === currentUser.id ? "bg-gray-900/75" : ""
            }`}
          >
            <span className="bg-gray-600 rounded-full h-8 w-8 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {p.display_name.substring(0, 2).toUpperCase()}
            </span>
            <span className="font-medium text-white truncate">
              {p.display_name}
            </span>
            {p.id === currentUser.id && (
              <span className="ml-auto text-sm font-semibold text-indigo-300">
                (You)
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}