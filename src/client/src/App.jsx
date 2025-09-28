import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import Contact from "./pages/Contact";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import Footer from "./components/Common/Footer";
import Room from "./pages/Room";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function App() {
  // As soon as the user creates a room, a new user object instance will be created and stored in the data
  // Whenever generate room is clicked -> generate user -> generate room
  // user info = displayName -> should persist between page refreshes but not between browser closes
  // id, null, displayName, joinedAt
  // room info = roomId -> same

  const [user, setUser] = useState(null);
  const [sharedFiles, setSharedFiles] = useState([]);
  const [roomParticipants, setRoomParticipants] = useState([]);
  const navigate = useNavigate();

  // Check if user is already saved
  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  async function ensureUserExists() {
    // Check if we need to create a new user
    if (user) {
      return user;
    }
    console.log("No existing user found, creating a new one...");
    const userResponse = await axios.post("/api/user", {});
    const currentUser = userResponse.data.data;

    setUser(currentUser);
    sessionStorage.setItem("user", JSON.stringify(currentUser));
    return currentUser;
  }

  async function handleCreateRoom() {
    try {
      const currentUser = await ensureUserExists();

      // Create the room using the (either existing or new) user's ID
      const roomResponse = await axios.post("/api/room", {
        createdBy: currentUser.id,
      });
      const newRoom = roomResponse.data.data;
      sessionStorage.setItem("roomId", newRoom.id);

      navigate(`/room/${newRoom.id}`);
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  }

  async function handleJoinRoom(roomId) {
    const currentUser = await ensureUserExists();

    try {
      const result = await axios.post(`/api/room/${roomId}`, {
        userId: currentUser.id,
      });
  
      setSharedFiles(result.data.data.fileData || []);
      setRoomParticipants(result.data.data.participants || []);

      navigate(`/room/${roomId}`);
    } catch (error) {
      console.log("Error while joining room", error);
      throw new Error("Failed to join room");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <Navbar user={user} />
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
          <Route
            path="/room/:roomId"
            element={
              <Room
                user={user}
                sharedFiles={sharedFiles}
                participants={roomParticipants}
              />
            }
          />
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
