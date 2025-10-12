import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Plus,
  LogIn,
  LogOut,
  X,
  Menu,
  CircleArrowOutUpRight,
  Loader2,
} from 'lucide-react'; // Import Menu and X icons
import { Link } from 'react-router-dom';
import fishLogo from '../../assets/nav-icon.png';
import UserNavbar from './userCorner';
import axios from 'axios';

export default function Navbar({ user, onLeaveRoom, isLoading }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    // Close the menu whenever navigation happens
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleGoToRoomClick = async () => {
    try {
      const result = await axios.get(`/api/user/current-room/${user.id}`);

      if (!result || result.length === 0) {
        throw new Error('Failed to go back to room');
      }

      // console.log(result);

      navigate(`/room/${result.data.data.roomId}`);
    } catch (error) {
      console.log(error);
      navigate(`/create-room`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-800/80 backdrop-blur-lg shadow-sm">
      <div className="flex justify-between items-center p-4 max-w-6xl mx-auto">
        {/* Logo (unchanged) */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={fishLogo} alt="SnipShare logo" className="w-10 h-10" />
          <h1 className="text-2xl font-bold text-indigo-400 tracking-wide">
            SnipShare
          </h1>
        </Link>

        {/* Desktop Nav Links (hidden on medium screens and below) */}
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
        <div className="hidden md:flex items-center space-x-3">
          <Link
            to="/create-room"
            className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-indigo-400 text-indigo-400 font-medium hover:bg-gray-700 transition"
          >
            <Plus size={18} />
            <span>Create Room</span>
          </Link>
          {/* Show Join Room or User Info based on user state */}
          {user ? (
            <>
              {location.pathname.startsWith('/room') ? (
                <button
                  onClick={() => onLeaveRoom(user.id)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-600 text-white font-medium shadow-md hover:bg-red-700 transition"
                >
                  {isLoading ? (
                    <>
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                        <span className="font-medium text-gray-300">
                          Loading...
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <LogOut size={18} />
                      <span>Leave Room</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleGoToRoomClick}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-indigo-400 text-indigo-400 font-medium hover:bg-gray-700 transition"
                >
                  <CircleArrowOutUpRight size={18} />
                  <span>Go to Room</span>
                </button>
              )}
              <UserNavbar user={user} />
            </>
          ) : (
            <Link
              to="/join-room"
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-500 text-white font-medium shadow-md hover:bg-indigo-600 transition"
            >
              {isLoading ? (
                <>
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                    <span className="font-medium text-gray-300">
                      Loading...
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Join Room</span>
                </>
              )}
            </Link>
          )}
        </div>

        {/* Hamburger Menu Button (only visible on medium screens and below) */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-4">
          {/* Mobile Nav Links */}
          <nav className="flex flex-col space-y-2 text-gray-300 font-medium">
            <Link
              to="/about"
              className="hover:text-indigo-400 transition block py-2"
            >
              About
            </Link>
            <Link
              to="/how-it-works"
              className="hover:text-indigo-400 transition block py-2"
            >
              How it Works
            </Link>
            <Link
              to="/contact"
              className="hover:text-indigo-400 transition block py-2"
            >
              Contact
            </Link>
          </nav>
          <hr className="border-gray-700" />

          {/* Mobile Buttons */}
          <div className="flex flex-col space-y-3">
            <Link
              to="/create-room"
              className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl border border-indigo-400 text-indigo-400 font-medium hover:bg-gray-700 transition"
            >
              <Plus size={18} />
              <span>Create Room</span>
            </Link>
            {user ? (
              <>
                {location.pathname.startsWith('/room') ? (
                  <button
                    onClick={() => onLeaveRoom(user.id)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-red-600 text-white font-medium shadow-md hover:bg-indigo-600 transition"
                  >
                    {isLoading ? (
                      <>
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                          <span className="font-medium text-gray-300">
                            Loading...
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <LogOut size={18} />
                        <span>Leave Room</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleGoToRoomClick}
                    className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-indigo-500 text-white font-medium shadow-md hover:bg-indigo-600 transition"
                  >
                    <CircleArrowOutUpRight size={18} />
                    <span>Go to Room</span>
                  </button>
                )}
                <div className="flex justify-center">
                  <UserNavbar user={user} />
                </div>
              </>
            ) : (
              <Link
                to="/join-room"
                className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-indigo-500 text-white font-medium shadow-md hover:bg-indigo-600 transition"
              >
                {isLoading ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                      <span className="font-medium text-gray-300">
                        Loading...
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>Join Room</span>
                  </>
                )}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
