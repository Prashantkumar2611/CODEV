import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const createRoom = () => {
    const newRoomId = uuidv4().slice(0, 8); // Short room ID
    setRoomId(newRoomId);
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      alert("Enter Room ID and your name!");
      return;
    }
    navigate(`/room/${roomId}`, { state: { username } });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl w-96 space-y-4">
        <h1 className="text-white text-3xl font-bold text-center">
          CollabCode
        </h1>
        <p className="text-gray-400 text-center">
          Code together, in real-time
        </p>

        <input
          className="w-full bg-gray-700 text-white p-3 rounded-lg"
          placeholder="Your Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div className="flex gap-2">
          <input
            className="flex-1 bg-gray-700 text-white p-3 rounded-lg"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button
            onClick={createRoom}
            className="bg-gray-600 text-white px-4 rounded-lg hover:bg-gray-500"
          >
            New
          </button>
        </div>

        <button
          onClick={joinRoom}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-500"
        >
          Join Room
        </button>
      </div>
    </div>
  );
}
