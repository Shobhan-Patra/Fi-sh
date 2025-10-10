export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-gray-100">
      <h2 className="text-4xl font-bold text-indigo-400">Contact Us</h2>
      <p className="mt-4 text-gray-300">
        We’d love to hear from you! Share feedback, feature requests, or bug
        reports.
      </p>

      <form className="mt-8 grid gap-6">
        <input
          type="email"
          placeholder="Your Email"
          className="p-3 rounded-lg w-full bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring focus:ring-indigo-500"
        />
        <textarea
          placeholder="Your Message"
          rows="5"
          className="p-3 rounded-lg w-full bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring focus:ring-indigo-500"
        ></textarea>
        <button className="px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition">
          Send Message
        </button>
      </form>
    </div>
  );
}
