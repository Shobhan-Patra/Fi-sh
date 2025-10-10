import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
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
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Check if user/participants is already saved
  useEffect(() => {
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith('/refresh-session')) {
      console.log('Clearing session.');
      sessionStorage.clear();
    }
  }, [location]);

  async function ensureUserExists() {
    // Check if we need to create a new user
    if (user) {
      return user;
    }
    try {
      console.log('No existing user found, creating a new one...');
      const userResponse = await axios.post('/api/user/', {});
      const currentUser = userResponse.data.data;

      setUser(() => currentUser);
      sessionStorage.setItem('user', JSON.stringify(currentUser));

      console.log('From userCreation function:', currentUser);
      return currentUser;
    } catch (error) {
      console.log('Error creating a new user: ', error);
      throw new Error('Failed to create new user');
    }
  }

  async function handleCreateRoom() {
    try {
      const currentUser = await ensureUserExists();

      const roomResponse = await axios.post('/api/room/', {
        userId: currentUser.id,
      });
      console.log(roomResponse);

      navigate(`/room/${roomResponse.data.data.roomId}`);
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  }

  async function handleJoinRoom(roomId) {
    try {
      const currentUser = await ensureUserExists();
      const result = await axios.post(`/api/room/${roomId}`, {
        userId: currentUser.id,
      });
      console.log('From join room: ', result.data);

      navigate(`/room/${roomId}`);
    } catch (error) {
      console.log('Error while joining room', error);
      throw new Error('Failed to join room');
    }
  }

  const handleLeaveRoomClick = async (userId) => {
    try {
      console.log('Leave room clicked');
      const result = await axios.post(`/api/room/leave/${userId}`, {});
      console.log(result);
    } catch (error) {
      console.log(error);
    } finally {
      setUser(null);
      sessionStorage.clear();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <Navbar user={user} onLeaveRoom={handleLeaveRoomClick} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/create-room"
            element={<CreateRoom onCreateRoom={handleCreateRoom} />}
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
