export default function ErrorToast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-red-600 text-white py-2 px-6 rounded-lg shadow-lg flex items-center z-50">
      <p>{message}</p>
      <button onClick={onClose} className="ml-4 font-bold text-lg">
        &times;
      </button>
    </div>
  );
}
