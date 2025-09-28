import { Upload, ShieldCheck, Zap } from "lucide-react";

export default function Features() {
  return (
    <section className="bg-gray-900 py-20 text-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <h3 className="text-3xl font-bold text-center text-indigo-400">
          Why Choose Fi-sh?
        </h3>
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-6 bg-gray-800 rounded-2xl shadow hover:shadow-lg transition">
            <Zap className="text-indigo-400 mb-4" size={36} />
            <h4 className="text-xl font-semibold mb-2">Lightning Fast</h4>
            <p className="text-gray-300">
              Upload and download speeds optimized with direct-to-cloud storage.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 bg-gray-800 rounded-2xl shadow hover:shadow-lg transition">
            <ShieldCheck className="text-indigo-400 mb-4" size={36} />
            <h4 className="text-xl font-semibold mb-2">Secure & Private</h4>
            <p className="text-gray-300">
              All files encrypted in transit and storage with expiring links.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 bg-gray-800 rounded-2xl shadow hover:shadow-lg transition">
            <Upload className="text-indigo-400 mb-4" size={36} />
            <h4 className="text-xl font-semibold mb-2">No Limits</h4>
            <p className="text-gray-300">
              Share files of any type with no account required.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
