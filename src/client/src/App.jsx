import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Common/Navbar';
import LandingPage from './pages/LandingPage';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import Contact from './pages/Contact';
import CreateRoom from './pages/CreateRoom';
import JoinRoom from './pages/JoinRoom';
import Footer from './components/Common/Footer';
import Room from './pages/Room';
import PrivacyPolicy from './pages/Privacy';
import TermsOfService from './pages/TOS';
import Support from './pages/Support';
import ErrorToast from './components/Common/ErrorToast';

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith('/refresh-session')) {
      sessionStorage.clear();
    }
  }, [location]);

  // Auto-dismiss logic for error toasts
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  async function ensureUserExists() {
    if (user) {
      return user;
    }
    try {
      const userResponse = await axios.post('/api/user/', {});
      const currentUser = userResponse.data.data;
      setUser(() => currentUser);
      sessionStorage.setItem('user', JSON.stringify(currentUser));
      return currentUser;
    } catch (err) {
      console.error('Error creating a new user: ', err);
      throw new Error('Could not create a new user session.');
    }
  }

  async function handleCreateRoom() {
    try {
      setIsLoading(true);
      const currentUser = await ensureUserExists();
      const roomResponse = await axios.post('/api/room/', {
        userId: currentUser.id,
      });
      setIsLoading(false);
      navigate(`/room/${roomResponse.data.data.roomId}`);
    } catch (err) {
      setError('Failed to create the room. Please try again.');
      console.error('Failed to create room:', err);
    }
  }

  async function handleJoinRoom(roomId) {
    try {
      setIsLoading(true);
      const currentUser = await ensureUserExists();
      await axios.post(`/api/room/${roomId}`, {
        userId: currentUser.id,
      });
      setIsLoading(false);
      navigate(`/room/${roomId}`);
    } catch (err) {
      setError('Could not join the room. Check the ID and try again.');
      console.error('Error while joining room', err);
    }
  }

  const handleLeaveRoomClick = async (userId) => {
    try {
      setIsLoading(true);
      await axios.post(`/api/room/leave/${userId}`, {});
    } catch (err) {
      setError('An error occurred while leaving the room.');
      console.error(err);
    } finally {
      sessionStorage.clear();
      setUser(null);
      setIsLoading(false);
      navigate('/');
      // console.log("Left the room (successfully or otherwise)")
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <ErrorToast message={error} onClose={() => setError(null)} />

      <Navbar
        user={user}
        onLeaveRoom={handleLeaveRoomClick}
        isLoading={isLoading}
      />
      <main className="flex-1">
        <Routes>
          {/* ... Your Routes remain the same ... */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/create-room"
            element={
              <CreateRoom
                onCreateRoom={handleCreateRoom}
                isLoading={isLoading}
              />
            }
          />
          <Route
            path="/join-room"
            element={<JoinRoom onJoinRoom={handleJoinRoom} />}
          />
          <Route path="/room" element={<Room />} />
          <Route path="/room/:roomId" element={<Room currentUser={user} />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/support" element={<Support />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
