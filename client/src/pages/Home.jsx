import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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

  const handleDeleteProject = async (e, projectId, projectName) => {
    e.stopPropagation(); // Prevent navigating to the room
    if (confirm(`Are you sure you want to delete the project "${projectName}"? This action cannot be undone.`)) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${import.meta.env.VITE_SERVER_URL || ''}/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProjects(prev => prev.filter(p => p._id !== projectId));
      } catch (err) {
        alert(err.response?.data?.error || "Failed to delete project");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center relative p-6">
      <div className="absolute top-6 right-6 flex flex-col items-end">
        <button 
          onClick={() => {
            if (confirm("Are you sure you want to logout?")) {
              logout();
            }
          }}
          className="relative group rounded-full ring-2 ring-gray-700 hover:ring-blue-500 transition-all shadow-lg hover:shadow-blue-500/20"
          title={`Logout (${user?.username})`}
        >
          <img 
            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.username}`} 
            alt={user?.username}
            className="w-12 h-12 rounded-full bg-[#E8E8E8] object-cover"
          />
          <div className="absolute -bottom-0.5 -right-0.5 bg-gray-900 rounded-full flex items-center justify-center p-[2px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#3b82f6" stroke="#3b82f6" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
              <path d="m9 12 2 2 4-4" stroke="white" strokeWidth="3" />
            </svg>
          </div>
        </button>
      </div>

      <div className="text-center mb-10">
        <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
          <h1 className="text-white text-4xl font-bold mb-2">CollabCode</h1>
        </Link>
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
                  <div key={proj._id} className="relative group w-full">
                    <button
                      onClick={() => navigate(`/room/${proj._id}`)}
                      className="w-full text-left bg-gray-800 hover:bg-gray-700 p-4 rounded-lg border border-gray-700 hover:border-gray-500 transition-all flex items-center justify-between pr-12"
                    >
                      <div>
                        <h3 className="text-white font-medium group-hover:text-blue-400 transition-colors">{proj.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">Files: <span className="text-gray-400">{proj.files?.length || 0}</span></p>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 group-hover:text-white transition-colors"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                    {proj.isOwner && (
                      <button
                        onClick={(e) => handleDeleteProject(e, proj._id, proj.name)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all z-10"
                        title="Delete Project"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
