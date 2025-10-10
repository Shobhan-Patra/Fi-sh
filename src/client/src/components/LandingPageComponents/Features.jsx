import { ShieldCheck, Zap, MousePointerClick } from 'lucide-react';

export default function Features() {
  return (
    <section className="bg-gray-900 py-20 text-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
            A Better Way to Share
          </h2>
          <p className="mt-4 text-xl text-gray-400">
            Fast, private, and incredibly simple.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1: Instant Sharing */}
          <div className="p-8 bg-gray-800 rounded-2xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
            <Zap className="text-indigo-400 mb-4" size={36} />
            <h3 className="text-xl font-semibold mb-2 text-white">
              Instant Sharing
            </h3>
            <p className="text-gray-400">
              Create a private room in seconds. Direct-to-cloud uploads mean
              your files are ready to share immediately.
            </p>
          </div>

          {/* Feature 2: Private by Design */}
          <div className="p-8 bg-gray-800 rounded-2xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
            <ShieldCheck className="text-indigo-400 mb-4" size={36} />
            <h3 className="text-xl font-semibold mb-2 text-white">
              Private by Design
            </h3>
            <p className="text-gray-400">
              Files are encrypted in transit and automatically deleted after 24
              hours. Your data is never kept long-term.
            </p>
          </div>

          {/* Feature 3: Simple & Account-Free */}
          <div className="p-8 bg-gray-800 rounded-2xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
            <MousePointerClick className="text-indigo-400 mb-4" size={36} />
            <h3 className="text-xl font-semibold mb-2 text-white">
              Simple & Account-Free
            </h3>
            <p className="text-gray-400">
              No sign-ups, no passwords, no hassle. Just create a room and start
              sharing with anyone.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
