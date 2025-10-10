import { Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto px-6 py-12 gap-12">
      {/* Left */}
      <div className="flex-1 text-gray-100">
        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Create a room, <br />
          <span className="text-indigo-400">Not an account.</span>
        </h2>
        <p className="mt-4 text-lg text-gray-300">
          Upload and share files securely with just a link. No signup required,
          no hassle — just fast, reliable transfers.
        </p>
        <Link to="/create-room" className="">
          <button className="mt-6 px-6 py-3 bg-indigo-500 text-white font-semibold rounded-xl shadow hover:bg-indigo-600 transition flex items-center gap-2">
            <Upload size={20} />
            Upload Your File
          </button>
        </Link>
      </div>

      {/* Right Illustration */}
      <div className="flex-1">
        <img
          src="/src/assets/hero.png"
          alt="file upload illustration"
          className="w-full rounded-xl shadow-lg"
        />
      </div>
    </section>
  );
}
