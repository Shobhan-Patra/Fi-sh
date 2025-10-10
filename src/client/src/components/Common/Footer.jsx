import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-400 py-6 mt-auto">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
        <p className="text-sm">
          © {new Date().getFullYear()} Fi-sh. <br></br>All rights reserved.
        </p>
        <div className="flex space-x-4">
          <Link to="/privacy-policy" className="hover:text-white transition">Privacy</Link>
          <Link to="/terms-of-service" className="hover:text-white transition">Terms</Link>
          <Link to="/support" className="hover:text-white transition">Support</Link>
        </div>
      </div>
    </footer>
  );
}
