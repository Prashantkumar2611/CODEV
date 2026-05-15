import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const createRoom = () => {
    const newRoomId = uuidv4().slice(0, 8); // Short room ID
    setRoomId(newRoomId);
  };

  const joinRoom = () => {
    if (!roomId) {
      alert("Enter Room ID!");
      return;
    }
    navigate(`/room/${roomId}`, { state: { username: user.username } });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center relative">
      <button 
        onClick={logout}
        className="absolute top-6 right-6 text-gray-400 hover:text-white font-medium bg-gray-800 px-4 py-2 rounded transition-colors"
      >
        Logout ({user?.username})
      </button>

      <div className="bg-gray-800 p-8 rounded-xl w-96 space-y-4 shadow-2xl border border-gray-700">
        <h1 className="text-white text-3xl font-bold text-center">
          CollabCode
        </h1>
        <p className="text-gray-400 text-center">
          Welcome back, <span className="font-semibold text-blue-400">{user?.username}</span>
        </p>

        <div className="flex gap-2 pt-4">
          <input
            className="flex-1 bg-gray-700 text-white p-3 rounded-lg outline-none focus:border-blue-500 border border-transparent transition-colors"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button
            onClick={createRoom}
            className="bg-gray-600 text-white px-4 rounded-lg hover:bg-gray-500 transition-colors"
          >
            New
          </button>
        </div>

        <button
          onClick={joinRoom}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-500 transition-colors shadow-lg"
        >
          Join Room
        </button>
      </div>
    </div>
  );
}
