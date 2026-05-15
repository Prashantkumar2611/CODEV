import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL || ''}/api/projects/my-projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to fetch projects");
    } finally {
      setLoadingProjects(false);
    }
  };

  const createQuickMeeting = () => {
    const newRoomId = uuidv4().slice(0, 8);
    navigate(`/room/${newRoomId}`);
  };

  const createProject = async () => {
    const name = prompt("Enter new Project Name:");
    if (!name || name.trim() === "") return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URL || ''}/api/projects/create`, 
        { name: name.trim() }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/room/${res.data._id}`);
    } catch (err) {
      alert("Failed to create project");
    }
  };

  const joinRoom = () => {
    if (!roomId) {
      alert("Please enter a valid Room ID to join.");
      return;
    }
    let finalRoomId = roomId.trim();
    if (finalRoomId.includes('/room/')) {
      finalRoomId = finalRoomId.split('/room/')[1];
    }
    navigate(`/room/${finalRoomId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center relative p-6">
      <button 
        onClick={logout}
        className="absolute top-6 right-6 text-gray-400 hover:text-white font-medium bg-gray-800 px-4 py-2 rounded transition-colors"
      >
        Logout ({user?.username})
      </button>

      <div className="text-center mb-10">
        <h1 className="text-white text-4xl font-bold mb-2">CollabCode</h1>
        <p className="text-gray-400">Welcome back, <span className="text-blue-400 font-semibold">{user?.username}</span></p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Quick Meetings */}
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 flex flex-col h-full">
          <h2 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            Quick Meetings
          </h2>
          <p className="text-sm text-gray-400 mb-6">Create a temporary room. Code disappears when everyone leaves.</p>

          <button
            onClick={createQuickMeeting}
            className="w-full bg-blue-600 text-white p-3.5 rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 mb-8"
          >
            Create Quick Meeting
          </button>

          <div className="flex items-center mb-6">
            <div className="flex-1 border-t border-gray-700"></div>
            <span className="px-4 text-gray-500 text-xs font-bold tracking-wider">OR JOIN ANY ROOM</span>
            <div className="flex-1 border-t border-gray-700"></div>
          </div>

          <div className="flex flex-col gap-3 mt-auto">
            <input
              className="w-full bg-gray-700/50 text-white p-3.5 rounded-xl outline-none focus:border-blue-500 border border-gray-600 transition-colors"
              placeholder="Paste Room ID or Link here"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && joinRoom()}
            />
            <button
              onClick={joinRoom}
              className="w-full bg-gray-700 text-white p-3.5 rounded-xl font-bold hover:bg-gray-600 transition-colors border border-gray-600"
            >
              Join Room
            </button>
          </div>
        </div>

        {/* Right Column: Persistent Projects */}
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-xl font-bold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              My Projects
            </h2>
            <button
              onClick={createProject}
              className="bg-green-600 hover:bg-green-500 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-1 shadow-lg shadow-green-600/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New Project
            </button>
          </div>
          <p className="text-sm text-gray-400 mb-4">Persistent workspaces. Code is saved to the database.</p>

          <div className="flex-1 bg-gray-900/50 rounded-xl border border-gray-700 p-2 overflow-y-auto max-h-[300px] custom-scrollbar">
            {loadingProjects ? (
              <p className="text-gray-500 text-center py-8 text-sm">Loading projects...</p>
            ) : projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 mb-3"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                <p className="text-gray-500 text-sm">No projects found.</p>
                <p className="text-gray-600 text-xs mt-1">Create one to get started.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {projects.map(proj => (
                  <button
                    key={proj._id}
                    onClick={() => navigate(`/room/${proj._id}`)}
                    className="w-full text-left bg-gray-800 hover:bg-gray-700 p-4 rounded-lg border border-gray-700 hover:border-gray-500 transition-all group flex items-center justify-between"
                  >
                    <div>
                      <h3 className="text-white font-medium group-hover:text-blue-400 transition-colors">{proj.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">Language: <span className="text-gray-400">{proj.language}</span></p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 group-hover:text-white transition-colors"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
