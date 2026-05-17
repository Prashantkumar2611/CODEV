import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ users, roomId, files = {}, activeFile, onFileSelect, onAddFile, onDeleteFile, isProject, projectName = "Project Phoenix" }) {
  const [showInvite, setShowInvite] = useState(false);
  const inviteLink = window.location.href; // Get current full URL
  const navigate = useNavigate();

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

  const [activeTab, setActiveTab] = useState("Explorer");

  return (
    <div className="w-64 bg-zinc-900 border-r border-zinc-800/80 p-5 flex flex-col font-sans text-zinc-200">
      {/* Top logo */}
      <div className="flex items-center gap-3 mb-6 cursor-pointer" onClick={() => navigate("/")}>
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center font-black text-zinc-950 shadow-lg text-md">P</div>
        <div className="flex flex-col">
          <span className="brand-logo-text font-bold text-sm tracking-tight bg-gradient-to-r from-orange-400 to-amber-250 bg-clip-text text-transparent">CODEV</span>
          <span className="text-[9px] text-zinc-500 font-medium">Workspace v1.0</span>
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

      {/* Tabs list matching the design */}
      <div className="space-y-0.5 mb-5">
        {[
          { name: "Explorer", icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21" /></svg> },
          { name: "Search", icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg> },
          { name: "Source Control", icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7" /><line x1="6" y1="9" x2="6" y2="21" /></svg> },
          { name: "Extensions", icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg> },
          { name: "Chat", icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> }
        ].map(item => (
          <button 
            key={item.name} 
            onClick={() => setActiveTab(item.name)}
            className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeTab === item.name ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/30"}`}
          >
            <span className={activeTab === item.name ? "text-orange-500" : "text-zinc-550"}>{item.icon}</span>
            {item.name}
          </button>
        ))}
      </div>

      {/* Explorer files list shown conditionally */}
      {activeTab === "Explorer" && isProject && (
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
        <button className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-500 hover:text-zinc-300 hover:bg-zinc-850/30 cursor-pointer transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          Settings
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-500 hover:text-zinc-300 hover:bg-zinc-850/30 cursor-pointer transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Account
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full mt-2 bg-red-950/20 border border-red-900/30 hover:bg-red-950/40 hover:text-red-400 text-red-400 font-semibold py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Leave Room
        </button>
      </div>
    </div>
  );
}
