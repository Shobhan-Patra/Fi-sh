export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20 text-gray-100">
      <h2 className="text-4xl font-bold text-indigo-400">About Fi-sh</h2>
      <p className="mt-6 text-lg text-gray-300 leading-relaxed">
        Fi-sh was created to make file sharing simple, fast, and fun.
        No more emailing files or slow messengers — create a room, drop your files,
        and instantly share them with a unique link.
      </p>

      <div className="mt-12 grid md:grid-cols-2 gap-10">
        <div className="p-6 bg-gray-800 rounded-xl shadow">
          <h3 className="text-xl font-semibold text-indigo-400">🎯 Our Mission</h3>
          <p className="mt-3 text-gray-300">
            To simplify file transfers with a lightweight, secure, and enjoyable tool —
            no clutter, no barriers.
          </p>
        </div>
        <div className="p-6 bg-gray-800 rounded-xl shadow">
          <h3 className="text-xl font-semibold text-indigo-400">🌍 Our Vision</h3>
          <p className="mt-3 text-gray-300">
            A future where sharing files is as easy as sending a text —
            no logins, no hassle, just click and share.
          </p>
        </div>
      </div>
    </div>
  );
}
