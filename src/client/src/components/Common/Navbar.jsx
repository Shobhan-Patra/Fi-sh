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
} from 'lucide-react';
import { Link } from 'react-router-dom';
import fishLogo from '../../assets/nav-icon.png';
import UserNavbar from './userCorner';
import axios from 'axios';

// --- Helper Component for Action Buttons ---
// This component encapsulates the button logic to avoid duplication.
const ActionButtons = ({
  user,
  isLoading,
  onLeaveRoom,
  handleGoToRoomClick,
  isGoToRoomLoading,
  containerClassName = '',
  buttonClassName = '',
}) => {
  const location = useLocation();

  return (
    <div className={containerClassName}>
      <Link
        to="/create-room"
        className={`flex items-center space-x-2 px-4 py-2 rounded-xl border border-indigo-400 text-indigo-400 font-medium hover:bg-gray-700 transition ${buttonClassName}`}
      >
        <Plus size={18} />
        <span>Create Room</span>
      </Link>

      {user ? (
        <>
          {location.pathname.startsWith('/room') ? (
            <button
              onClick={() => onLeaveRoom(user.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-600 text-white font-medium shadow-md hover:bg-red-700 transition ${buttonClassName}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
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
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl border border-indigo-400 text-indigo-400 font-medium hover:bg-gray-700 transition ${buttonClassName}`}
              disabled={isGoToRoomLoading}
            >
              {isGoToRoomLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <CircleArrowOutUpRight size={18} />
                  <span>Go to Room</span>
                </>
              )}
            </button>
          )}
          <div className={buttonClassName}>
            <UserNavbar user={user} />
          </div>
        </>
      ) : (
        <Link
          to="/join-room"
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-500 text-white font-medium shadow-md hover:bg-indigo-600 transition ${buttonClassName}`}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <LogIn size={18} />
              <span>Join Room</span>
            </>
          )}
        </Link>
      )}
    </div>
  );
};

export default function Navbar({ user, onLeaveRoom, isLoading }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGoToRoomLoading, setIsGoToRoomLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Close the mobile menu whenever navigation happens
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleGoToRoomClick = async () => {
    setIsGoToRoomLoading(true);
    try {
      const result = await axios.get(`/api/user/current-room/${user.id}`);
      // A user not in a room is a valid scenario, not an error.
      if (result.data?.data?.roomId) {
        navigate(`/room/${result.data.data.roomId}`);
      } else {
        // If the user isn't in a room, guide them to create one.
        navigate(`/create-room`);
      }
    } catch (error) {
      console.error('Failed to get current room:', error);
      navigate(`/create-room`);
    } finally {
      setIsGoToRoomLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-800/80 backdrop-blur-lg shadow-sm">
      <div className="flex justify-between items-center p-4 max-w-6xl mx-auto">
        <Link to="/" className="flex items-center space-x-2">
          <img src={fishLogo} alt="SnipShare logo" className="w-10 h-10" />
          <h1 className="text-2xl font-bold text-indigo-400 tracking-wide">
            SnipShare
          </h1>
        </Link>

        {/* Desktop Nav Links */}
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

        {/* Desktop Buttons */}
        <ActionButtons
          containerClassName="hidden md:flex items-center space-x-3"
          user={user}
          isLoading={isLoading}
          onLeaveRoom={onLeaveRoom}
          handleGoToRoomClick={handleGoToRoomClick}
          isGoToRoomLoading={isGoToRoomLoading}
        />

        {/* Hamburger Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-4">
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
          <ActionButtons
            containerClassName="flex flex-col space-y-3"
            buttonClassName="justify-center"
            user={user}
            isLoading={isLoading}
            onLeaveRoom={onLeaveRoom}
            handleGoToRoomClick={handleGoToRoomClick}
            isGoToRoomLoading={isGoToRoomLoading}
          />
        </div>
      )}
    </header>
  );
}
