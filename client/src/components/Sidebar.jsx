import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import { User, LogOut, Home as HomeIcon, Settings, X, Folder, Users, GitBranch, Puzzle, MessageSquare } from 'lucide-react';
import { GooeyFilter } from './ui/gooey-filter';

export default function Sidebar({ users, roomId, files = {}, activeFile, onFileSelect, onAddFile, onDeleteFile, isProject, projectName = "Project Phoenix", projectOwner = "" }) {
  const [showInvite, setShowInvite] = useState(false);
  const inviteLink = window.location.href; // Get current full URL
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [isTopGooeyOpen, setIsTopGooeyOpen] = useState(false);

  const getCleanName = (emailOrUsername) => {
    if (!emailOrUsername) return "";
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

  // Get clean names
  const cleanOwnerName = projectOwner ? getCleanName(projectOwner) : "";

  // Map real connected socket users
  const activeSocketUsers = users.map(u => {
    const isThisUserOwner = cleanOwnerName && u.username.toLowerCase() === cleanOwnerName.toLowerCase();
    return {
      name: u.username,
      role: isThisUserOwner ? "Project Owner" : "Collaborator",
      color: u.color || "#f97316",
      status: u.typing ? "Typing..." : "Active Now",
      isOnline: true,
      id: u.id
    };
  });

  // Check if owner is online
  const isOwnerOnline = cleanOwnerName && activeSocketUsers.some(u => u.name.toLowerCase() === cleanOwnerName.toLowerCase());

  const buildersList = [];

  // 1. Add Owner first
  if (cleanOwnerName) {
    if (isOwnerOnline) {
      // Find owner in active list
      const onlineOwner = activeSocketUsers.find(u => u.name.toLowerCase() === cleanOwnerName.toLowerCase());
      if (onlineOwner) buildersList.push(onlineOwner);
    } else {
      // Add offline owner card
      buildersList.push({
        name: cleanOwnerName,
        role: "Project Owner",
        color: "#52525b",
        status: "Offline",
        isOnline: false,
        id: "offline-owner"
      });
    }
  }

  // 2. Add other collaborators
  activeSocketUsers.forEach(u => {
    if (cleanOwnerName && u.name.toLowerCase() === cleanOwnerName.toLowerCase()) return; // Already added as owner
    buildersList.push(u);
  });

  // 3. Fallback for Quick Rooms or if no owner loaded yet
  if (buildersList.length === 0) {
    activeSocketUsers.forEach(u => buildersList.push(u));
  }

  // Deduplicate builders list to avoid ghost tab connections or duplicate listings
  const uniqueBuilders = [];
  const seenNames = new Set();
  buildersList.forEach(b => {
    const cleanLower = b.name.toLowerCase();
    if (!seenNames.has(cleanLower)) {
      seenNames.add(cleanLower);
      uniqueBuilders.push(b);
    }
  });

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert("Invite link copied!");
  };

  const shareLink = async () => {
    const shareData = {
      title: 'Join my CODEV Room',
      text: `Join my live coding room on CODEV! Room ID: ${roomId}`,
      url: inviteLink,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("Sharing is not supported in this browser. Please use Copy instead.");
    }
  };

  const [activeTab, setActiveTab] = useState("Files");

  return (
    <div className="w-64 bg-zinc-900 border-r border-zinc-800/80 p-5 flex flex-col font-sans text-zinc-200">
      {/* Dynamic Gooey Top Navigation Hamburger Menu */}
      <div 
        className="relative z-50 flex items-center gap-4 mb-6"
        onMouseEnter={() => setIsTopGooeyOpen(true)}
        onMouseLeave={() => setIsTopGooeyOpen(false)}
      >
        <GooeyFilter id="gooey-nav-menu" strength={5} />
        
        <div 
          className="relative flex flex-col items-center justify-center min-h-[40px] w-10"
          style={{ filter: "url(#gooey-nav-menu)" }}
        >
          {/* Sub-options popping DOWNWARDS */}
          <AnimatePresence>
            {isTopGooeyOpen && [
              { name: "Files", icon: Folder, tooltip: "Workspace Files" },
              { name: "Members", icon: Users, tooltip: "Project Members" },
              { name: "Source Control", icon: GitBranch, tooltip: "Git Control" },
              { name: "Extensions", icon: Puzzle, tooltip: "Addons & Plugins" },
              { name: "Chat", icon: MessageSquare, tooltip: "Live Chat" }
            ].map((item, index) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              return (
                <motion.button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  title={item.tooltip}
                  className={`absolute w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-lg z-40 transition-colors ${isActive ? 'bg-orange-500 text-white border border-orange-400/30' : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'}`}
                  initial={{ y: 0, opacity: 0 }}
                  animate={{
                    y: (index + 1) * 44, // Popping DOWNWARDS!
                    opacity: 1,
                  }}
                  exit={{
                    y: 0,
                    opacity: 0,
                    transition: {
                      delay: (5 - index) * 0.05,
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
                      key={item.name}
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
            className="relative w-10 h-10 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center cursor-pointer z-50 shadow-lg shadow-orange-500/20 border border-orange-400/30"
            onClick={() => setIsTopGooeyOpen(!isTopGooeyOpen)}
            title="Open Workspace Navigation"
          >
            <AnimatePresence mode="wait">
              {isTopGooeyOpen ? (
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

        {/* Active Tab Indicator right next to it */}
        <div className="flex flex-col cursor-pointer ml-1" onClick={() => navigate("/")}>
          <span className="text-[9px] text-zinc-555 font-bold uppercase tracking-wider">Active View</span>
          <span className="text-xs font-extrabold text-orange-400 tracking-wide uppercase">{activeTab}</span>
        </div>
      </div>

      {/* Invite Friends Button */}
      <button 
        onClick={() => setShowInvite(!showInvite)}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-xl mb-5 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/10 cursor-pointer text-xs"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
        Invite Friends
      </button>

      {showInvite && (
        <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-850 mb-5 shadow-inner transition-all">
          <p className="text-[9px] text-zinc-550 mb-1.5 font-bold uppercase tracking-wider">Invite Link</p>
          <input 
            type="text" 
            readOnly 
            value={inviteLink}
            className="w-full bg-zinc-900 text-zinc-300 text-xs p-2 rounded-lg border border-zinc-800 mb-2 outline-none"
          />
          <div className="flex gap-2">
            <button onClick={copyLink} className="flex-1 bg-zinc-800 hover:bg-zinc-750 text-[10px] font-semibold text-zinc-300 py-1.5 rounded-lg transition-colors cursor-pointer">
              Copy
            </button>
            <button onClick={shareLink} className="flex-1 bg-orange-500/15 border border-orange-500/30 text-orange-400 hover:bg-orange-500 hover:text-white text-[10px] font-semibold py-1.5 rounded-lg transition-all cursor-pointer">
              Share
            </button>
          </div>
        </div>
      )}

      {/* Current Room Info Section */}
      <div className="bg-zinc-950 border border-zinc-850/80 p-3 rounded-xl mb-5">
        <p className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider mb-1">Current Room</p>
        <h3 className="text-white text-xs font-bold truncate">{projectName}</h3>
        <p className="text-[10px] text-zinc-550 mt-0.5 truncate">ID: {roomId}</p>
      </div>

      {/* Tabs list replaced by gooey menu navigation */}

      {/* Files list shown conditionally */}
      {activeTab === "Files" && isProject && (
        <div className="mb-5 border-t border-zinc-850 pt-4">
          <div className="flex justify-between items-center mb-2 px-1">
            <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Workspace Files</p>
            <button 
              onClick={onAddFile}
              className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-850 transition-colors cursor-pointer"
              title="New File"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>
          <div className="space-y-0.5 overflow-y-auto max-h-[160px] custom-scrollbar">
            {Object.keys(files).map(filename => (
              <div 
                key={filename} 
                className={`flex items-center justify-between group px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${activeFile === filename ? 'bg-orange-500/10 text-orange-400 border-orange-500/15' : 'text-zinc-400 hover:bg-zinc-850 hover:text-white border-transparent'}`}
              >
                <button
                  onClick={() => onFileSelect(filename)}
                  className="flex-1 text-left truncate cursor-pointer font-mono text-[11px]"
                >
                  📄 {filename}
                </button>
                <button
                  onClick={() => onDeleteFile(filename)}
                  className="opacity-0 group-hover:opacity-100 text-zinc-550 hover:text-red-400 transition-opacity p-0.5 cursor-pointer"
                  title="Delete File"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Members tab panel */}
      {activeTab === "Members" && (
        <div className="mb-5 border-t border-zinc-850 pt-4">
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-3 px-1">Project Builders</p>
          <div className="space-y-2 overflow-y-auto max-h-[180px] custom-scrollbar">
            {uniqueBuilders.map(m => (
              <div key={m.id || m.name} className="bg-zinc-950/80 border border-zinc-850/50 p-2.5 rounded-xl flex items-center justify-between hover:border-zinc-800 transition-colors">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                    style={{ backgroundColor: m.color }}
                  >
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-zinc-100">{m.name}</span>
                      {m.isOnline ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" title="Connected Live" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" title="Offline" />
                      )}
                    </div>
                    <span className="text-[9px] text-zinc-500 font-medium">{m.role}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded-full border ${
                    m.isOnline 
                      ? 'text-orange-400 bg-orange-500/10 border-orange-500/20' 
                      : 'text-zinc-500 bg-zinc-850/50 border-zinc-800'
                  }`}>
                    {m.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Online/Room Members header */}
      <div className="flex justify-between items-center mb-3 mt-auto border-t border-zinc-850 pt-4">
        <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Room Members ({users.length})</p>
      </div>

      <div className="space-y-1.5 overflow-y-auto max-h-[140px] custom-scrollbar mb-4">
        {users.map(u => (
          <div key={u.id} className="flex items-center justify-between p-1 rounded-lg hover:bg-zinc-850/40 transition-colors">
            <div className="flex items-center gap-2">
              <div 
                className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white shadow"
                style={{ backgroundColor: u.color || '#f97316' }}
              >
                {u.username.substring(0, 1).toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-zinc-300 truncate max-w-[120px]">{u.username}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {u.typing ? (
                <span className="text-[9px] text-orange-400 italic animate-pulse">Typing...</span>
              ) : (
                <div 
                  className="w-1.5 h-1.5 rounded-full" 
                  style={{ backgroundColor: u.color || '#f97316', boxShadow: `0 0 6px ${u.color}` }}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Mock Sidebar Controls */}
      <div className="border-t border-zinc-850 pt-3 flex flex-col gap-0.5">
        <button className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-500 hover:text-zinc-300 hover:bg-zinc-850/30 cursor-pointer transition-all" onClick={() => alert("Workspace configurations loaded.")}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          Settings
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-500 hover:text-zinc-300 hover:bg-zinc-850/30 cursor-pointer transition-all" onClick={() => alert(`Signed in as: ${getCleanName(user?.username)}`)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Account
        </button>
        <button
          onClick={() => {
            if (confirm("Are you sure you want to leave this coding room?")) {
              navigate('/dashboard');
            }
          }}
          className="w-full mt-2 bg-red-950/20 border border-red-900/30 hover:bg-red-950/40 hover:text-red-400 text-red-400 font-semibold py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Leave Room
        </button>
      </div>
    </div>
  );
}
