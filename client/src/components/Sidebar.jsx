import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ users, roomId, files = {}, activeFile, onFileSelect, onAddFile, onDeleteFile, isProject }) {
  const [showInvite, setShowInvite] = useState(false);
  const inviteLink = window.location.href; // Get current full URL
  const navigate = useNavigate();

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert("Invite link copied!");
  };

  const shareLink = async () => {
    const shareData = {
      title: 'Join my CollabCode Room',
      text: `Join my live coding room on CollabCode! Room ID: ${roomId}`,
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

  return (
    <div className="w-64 bg-zinc-900 border-r border-zinc-800/80 p-5 flex flex-col font-sans text-zinc-200">
      <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => navigate("/")}>
        <img src="/favicon.svg" alt="CollabCode Logo" className="w-6 h-6 object-contain" />
        <span className="font-bold text-md tracking-tight bg-gradient-to-r from-orange-400 to-amber-250 bg-clip-text text-transparent">CollabCode</span>
      </div>

      <button 
        onClick={() => setShowInvite(!showInvite)}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 px-4 rounded-xl mb-4 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/10 cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
        Invite Friends
      </button>

      {showInvite && (
        <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 mb-6 shadow-inner transition-all duration-300 ease-in-out">
          <p className="text-[10px] text-zinc-500 mb-2 font-bold uppercase tracking-wider">Invite Link</p>
          <input 
            type="text" 
            readOnly 
            value={inviteLink}
            className="w-full bg-zinc-900 text-zinc-300 text-xs p-2.5 rounded-lg border border-zinc-800/80 mb-3 outline-none"
          />
          <div className="flex gap-2">
            <button onClick={copyLink} className="flex-1 bg-zinc-800 hover:bg-zinc-750 text-xs font-semibold text-zinc-300 py-2 rounded-lg transition-colors cursor-pointer">
              Copy
            </button>
            <button onClick={shareLink} className="flex-1 bg-orange-500/15 border border-orange-500/30 text-orange-400 hover:bg-orange-500 hover:text-white text-xs font-semibold py-2 rounded-lg transition-all cursor-pointer">
              Share
            </button>
          </div>
        </div>
      )}

      {isProject && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Files</p>
            <button 
              onClick={onAddFile}
              className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
              title="New File"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>
          <div className="space-y-1">
            {Object.keys(files).map(filename => (
              <div 
                key={filename} 
                className={`flex items-center justify-between group px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${activeFile === filename ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white border-transparent'}`}
              >
                <button
                  onClick={() => onFileSelect(filename)}
                  className="flex-1 text-left truncate cursor-pointer font-mono text-xs"
                >
                  {filename}
                </button>
                <button
                  onClick={() => onDeleteFile(filename)}
                  className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-opacity p-1 cursor-pointer"
                  title="Delete File"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4 mt-auto">
        <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Online</p>
        <span className="bg-zinc-800 text-zinc-300 text-[10px] font-bold px-2 py-0.5 rounded-full">{users.length}</span>
      </div>

      <div className="space-y-3 overflow-y-auto flex-1 custom-scrollbar">
        {users.map(user => (
          <div key={user.id} className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-zinc-850/50 transition-colors">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: user.color, boxShadow: `0 0 8px ${user.color}` }}
            />
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-semibold text-zinc-200 truncate">{user.username}</span>
              {isProject && user.activeFile && <span className="text-[10px] text-zinc-500 truncate">in {user.activeFile}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-800">
        <button
          onClick={() => navigate('/')}
          className="w-full bg-red-950/20 border border-red-900/30 hover:bg-red-950/40 hover:text-red-400 text-red-400 font-medium py-2 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer text-xs"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Leave Room
        </button>
      </div>
    </div>
  );
}
