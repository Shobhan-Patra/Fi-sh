export default function NotificationToast({ message, onClose }) {
    if (!message) return null;

    return (
      //   <div
      //       className={`
      //   fixed top-5 right-5 z-50 rounded-lg bg-slate-700 px-4 py-2 text-white shadow-lg
      //   transition-all duration-300 ease-in-out
      //   translate-y-0 opacity-100
      // `}
      //   >
      //       <p>{message}</p>
      //   </div>
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-blue-800 text-white py-2 px-6 rounded-lg shadow-lg flex items-center z-50">
            <p>{message}</p>
            <button onClick={onClose} className="ml-4 font-bold text-lg">
                &times;
            </button>
        </div>
    );
}