import { Plus, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import fishLogo from "../assets/nav-icon.png";
import UserNavbar from "./userCorner";

export default function Navbar({ user }) {
  return (
    <header className="sticky top-0 z-50 bg-gray-800/80 backdrop-blur-lg shadow-sm">
      <div className="flex justify-between items-center p-4 max-w-6xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src={fishLogo}
            alt="Fi-sh logo"
            className="w-10 h-10 object-contain drop-shadow-md"
          />
          <h1 className="text-2xl font-bold text-indigo-400 tracking-wide">
            Fi-sh
          </h1>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex space-x-6 text-gray-300 font-medium">
          <Link to="/about" className="hover:text-indigo-400 transition">
            About
          </Link>
          <Link to="/how-it-works" className="hover:text-indigo-400 transition">
            How it Works
          </Link>
          <Link to="/contact" className="hover:text-indigo-400 transition">
            Contact
          </Link>
        </nav>

        {/* Buttons */}
        <div className="flex space-x-3">
          <Link
            to="/create-room"
            className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-indigo-400 text-indigo-400 font-medium hover:bg-gray-700 transition"
          >
            <Plus size={18} />
            <span>Create Room</span>
          </Link>

          {user ? (
            <UserNavbar user={user} />
          ) : (
            <Link
              to="/join-room"
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-500 text-white font-medium shadow-md hover:bg-indigo-600 transition"
            >
              <LogIn size={18} />
              <span>Join Room</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
