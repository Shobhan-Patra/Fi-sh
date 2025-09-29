import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Common/Navbar";
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
  const [user, setUser] = useState(null);
  const [sharedFiles, setSharedFiles] = useState([]);
  const [roomParticipants, setRoomParticipants] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is already saved
  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // TODO: remove in production
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (sessionStorage.getItem("roomId")) {
        return;
      }
      sessionStorage.clear();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const isInsideRoom = location.pathname.startsWith("/room/");

    if (!isInsideRoom) {
      console.log("User is not in a room, clearing session.");
      sessionStorage.removeItem("roomId");
    }
  }, [location]);

  async function ensureUserExists() {
    // Check if we need to create a new user
    if (user) {
      return user;
    }
    try {
      console.log("No existing user found, creating a new one...");
      const userResponse = await axios.post("/api/user/", {});
      const currentUser = userResponse.data.data;

      setUser(() => currentUser);
      sessionStorage.setItem("user", JSON.stringify(currentUser));

      console.log("From userCreation function:",currentUser);
      return currentUser;
    } catch (error) {
      console.log("Error creating a new user: ", error);
      throw new Error("Failed to create new user");
    }
  }

  async function handleCreateRoom() {
    try {
      const currentUser = await ensureUserExists();

      const roomResponse = await axios.post("/api/room/", { userId: currentUser.id });
      console.log(roomResponse);

      const newRoomId = roomResponse.data.data.roomId;
      const participants = roomResponse.data.data.participants;
      
      sessionStorage.setItem("roomId", newRoomId);
      setRoomParticipants(participants);

      navigate(`/room/${newRoomId}`);
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  }

  async function handleJoinRoom(roomId) {
    try {
      const currentUser = await ensureUserExists();
      const result = await axios.post(`/api/room/${roomId}`, {
        userId: currentUser.id,
      });

      sessionStorage.setItem("roomId", roomId);
      setSharedFiles(result.data.data.fileData || []);
      setRoomParticipants(result.data.data.participants || []);

      console.log(result.data);

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
                currentUser={user}
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
