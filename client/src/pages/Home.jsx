import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Home as HomeIcon, Settings, User, X } from "lucide-react";
import { GooeyFilter } from "../components/ui/gooey-filter";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isGooeyOpen, setIsGooeyOpen] = useState(false);
  
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const getCleanName = (emailOrUsername) => {
    if (!emailOrUsername) return "Guest";
    if (emailOrUsername.includes("@")) {
      const parts = emailOrUsername.split("@")[0];
      return parts
        .split(/[\._\-]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .filter(Boolean)
        .join(" ");
    }
    return emailOrUsername.charAt(0).toUpperCase() + emailOrUsername.slice(1);
  };

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
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center relative p-6 font-sans text-zinc-100">
      
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[30%] h-[30%] bg-orange-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-zinc-800/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="absolute top-6 right-6 flex items-center gap-4 z-50">
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center justify-center shadow-lg"
          title={theme === 'light' ? 'Switch to Night Mode' : 'Switch to Day Mode'}
        >
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
          )}
        </button>

        {/* Dynamic Gooey Hover Menu */}
        <div 
          className="relative z-50 flex flex-col items-center"
          onMouseEnter={() => setIsGooeyOpen(true)}
          onMouseLeave={() => setIsGooeyOpen(false)}
        >
          <GooeyFilter id="gooey-profile-menu" strength={5} />
          
          <div 
            className="relative flex flex-col items-center"
            style={{ filter: "url(#gooey-profile-menu)" }}
          >
            {/* Gooey Sub-options (vertical drop) */}
            <AnimatePresence>
              {isGooeyOpen && [
                { 
                  icon: User, 
                  label: "Profile", 
                  color: "bg-zinc-900 border border-zinc-800 text-zinc-100 hover:bg-zinc-850 hover:border-zinc-700",
                  tooltip: `Signed in as: ${getCleanName(user?.username)}`,
                  action: () => alert(`Signed in as: ${getCleanName(user?.username)}`)
                },
                { 
                  icon: Settings, 
                  label: "Theme", 
                  color: "bg-zinc-900 border border-zinc-800 text-orange-400 hover:bg-orange-550/10 hover:border-orange-500/30",
                  tooltip: `Switch to ${theme === 'light' ? 'Night' : 'Day'} Mode`,
                  action: toggleTheme
                },
                { 
                  icon: LogOut, 
                  label: "Logout", 
                  color: "bg-red-950/20 border border-red-900/30 text-red-400 hover:bg-red-900 hover:text-white",
                  tooltip: "Logout Account",
                  action: () => {
                    if (confirm("Are you sure you want to logout?")) {
                      logout();
                      navigate("/");
                    }
                  }
                }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.label}
                    onClick={item.action}
                    title={item.tooltip}
                    className={`absolute w-11 h-11 rounded-full flex items-center justify-center cursor-pointer shadow-lg z-40 transition-colors ${item.color}`}
                    initial={{ y: 0, opacity: 0 }}
                    animate={{
                      y: (index + 1) * 48,
                      opacity: 1,
                    }}
                    exit={{
                      y: 0,
                      opacity: 0,
                      transition: {
                        delay: (3 - index) * 0.05,
                        duration: 0.35,
                        type: "spring",
                        bounce: 0,
                      },
                    }}
                    transition={{
                      delay: index * 0.05,
                      duration: 0.35,
                      type: "spring",
                      bounce: 0,
                    }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Icon className="w-4 h-4" />
                      </motion.div>
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </AnimatePresence>

            {/* Main Premium Hamburger Toggle Button */}
            <motion.button
              className="relative w-11 h-11 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center cursor-pointer z-50 shadow-lg shadow-orange-500/20 border border-orange-400/30"
              onClick={() => setIsGooeyOpen(!isGooeyOpen)}
              title="Menu Options"
            >
              <AnimatePresence mode="wait">
                {isGooeyOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-4 h-4 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-0.5 items-center justify-center"
                  >
                    <div className="w-4 h-0.5 bg-white rounded-full" />
                    <div className="w-4 h-0.5 bg-white rounded-full" />
                    <div className="w-4 h-0.5 bg-white rounded-full" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="text-center mb-10 relative z-10">
        <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img src="/favicon.svg" alt="Logo" className="w-10 h-10" />
            <h1 className="brand-logo-text text-white text-4xl font-bold tracking-tight">CODEV</h1>
          </div>
        </Link>
        <p className="text-zinc-400 text-sm">Welcome back, <span className="text-orange-400 font-bold">{getCleanName(user?.username)}</span></p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        
        {/* Left Column: Quick Meetings */}
        <div className="bg-zinc-900 p-8 rounded-2xl shadow-2xl border border-zinc-800/80 flex flex-col h-full backdrop-blur-sm">
          <h2 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            Quick Meetings
          </h2>
          <p className="text-sm text-zinc-400 mb-6">Create a temporary room. Code disappears when everyone leaves.</p>

          <button
            onClick={createQuickMeeting}
            className="w-full bg-orange-500 text-white p-3.5 rounded-xl font-bold hover:bg-orange-600 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg shadow-orange-500/10 flex items-center justify-center gap-2 mb-8 cursor-pointer"
          >
            Create Quick Meeting
          </button>

          <div className="flex items-center mb-6">
            <div className="flex-1 border-t border-zinc-800"></div>
            <span className="px-4 text-zinc-550 text-[10px] font-bold tracking-widest uppercase">OR JOIN ANY ROOM</span>
            <div className="flex-1 border-t border-zinc-800"></div>
          </div>

          <div className="flex flex-col gap-3 mt-auto">
            <input
              className="w-full bg-zinc-950 text-white p-3.5 rounded-xl outline-none focus:border-orange-500/80 border border-zinc-800 transition-colors placeholder:text-zinc-600"
              placeholder="Paste Room ID or Link here"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && joinRoom()}
            />
            <button
              onClick={joinRoom}
              className="w-full bg-zinc-800 text-zinc-200 p-3.5 rounded-xl font-bold hover:bg-zinc-755 hover:text-white transition-all border border-zinc-700 cursor-pointer"
            >
              Join Room
            </button>
          </div>
        </div>

        {/* Right Column: Persistent Projects */}
        <div className="bg-zinc-900 p-8 rounded-2xl shadow-2xl border border-zinc-800/80 flex flex-col h-full backdrop-blur-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-xl font-bold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-550"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              My Projects
            </h2>
            <button
              onClick={createProject}
              className="bg-orange-500 hover:bg-orange-655 text-white text-sm font-bold py-2 px-4 rounded-xl transition-all hover:scale-[1.01] flex items-center gap-1 shadow-lg shadow-orange-500/10 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New Project
            </button>
          </div>
          <p className="text-sm text-zinc-400 mb-4">Persistent workspaces. Code is saved to the database.</p>

          <div className="flex-1 bg-zinc-950/50 rounded-xl border border-zinc-800/80 p-2 overflow-y-auto max-h-[300px] custom-scrollbar">
            {loadingProjects ? (
              <p className="text-zinc-500 text-center py-8 text-sm">Loading projects...</p>
            ) : projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-700 mb-3"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                <p className="text-zinc-550 text-sm">No projects found.</p>
                <p className="text-zinc-600 text-xs mt-1">Create one to get started.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {projects.map(proj => (
                  <div key={proj._id} className="relative group w-full">
                    <button
                      onClick={() => navigate(`/room/${proj._id}`)}
                      className="w-full text-left bg-zinc-900/60 hover:bg-zinc-850 p-4 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-between pr-12 cursor-pointer"
                    >
                      <div>
                        <h3 className="text-zinc-200 font-medium group-hover:text-orange-400 transition-colors">{proj.name}</h3>
                        <p className="text-[10px] text-zinc-500 mt-1">Files: <span className="text-zinc-400">{proj.files?.length || 0}</span></p>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-650 group-hover:text-orange-400 transition-colors"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                    {proj.isOwner && (
                      <button
                        onClick={(e) => handleDeleteProject(e, proj._id, proj.name)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all z-10 cursor-pointer"
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
