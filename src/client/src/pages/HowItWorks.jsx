export default function HowItWorks() {
  return (
    <div className="bg-gray-900 py-20 text-gray-100">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-indigo-400 text-center">
          How it Works
        </h2>
        <p className="mt-4 text-lg text-gray-300 text-center">
          Sharing files with SnipShare is quick and effortless. Here’s how you
          can get started in 4 simple steps:
        </p>

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          {[
            {
              step: '1️⃣ Create a Room',
              text: "Click 'Create Room' to generate a secure space.",
            },
            {
              step: '2️⃣ Upload Files',
              text: 'Drag & drop your files, or select them manually.',
            },
            {
              step: '3️⃣ Share the Room Code',
              text: 'Send the unique room code to others.',
            },
            {
              step: '4️⃣ Instant Access',
              text: 'They can instantly download or view files securely.',
            },
          ].map((item, i) => (
            <div key={i} className="p-6 bg-gray-800 rounded-xl shadow">
              <h3 className="text-xl font-semibold">{item.step}</h3>
              <p className="mt-2 text-gray-300">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
