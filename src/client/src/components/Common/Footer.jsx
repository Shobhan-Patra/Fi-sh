export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-400 py-6 mt-auto">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
        <p className="text-sm">
          © {new Date().getFullYear()} Fi-sh. All rights reserved.
        </p>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-indigo-400">Privacy</a>
          <a href="#" className="hover:text-indigo-400">Terms</a>
          <a href="#" className="hover:text-indigo-400">Support</a>
        </div>
      </div>
    </footer>
  );
}
