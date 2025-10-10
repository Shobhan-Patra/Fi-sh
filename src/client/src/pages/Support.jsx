import { Mail } from 'lucide-react';

export default function Support() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center text-gray-100">
      <h1 className="text-4xl font-bold text-indigo-400 mb-4">
        Support & Contact
      </h1>
      <p className="mt-4 text-lg text-gray-300">
        Have a question, a bug report, or feedback? We'd love to hear from you.
      </p>

      <div className="mt-12">
        <a
          href="mailto:support@fi-sh-app.com"
          className="inline-flex items-center justify-center space-x-3 px-6 py-3 border border-transparent text-lg font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition"
        >
          <Mail size={20} />
          <span>Contact Us via Email</span>
        </a>
        <p className="mt-6 text-gray-400">
          We do our best to respond to all inquiries within 48 hours.
        </p>
      </div>
    </div>
  );
}
