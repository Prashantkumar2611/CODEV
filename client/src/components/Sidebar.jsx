import { useState } from 'react';

export default function Sidebar({ users, roomId }) {
  const [showInvite, setShowInvite] = useState(false);
  const inviteLink = window.location.href; // Get current full URL

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
    <div className="w-64 bg-gray-800 border-r border-gray-700 p-5 flex flex-col font-sans">
      <h2 className="text-xl font-bold text-white mb-6">CollabCode</h2>

      <button 
        onClick={() => setShowInvite(!showInvite)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg mb-4 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
        Invite Friends
      </button>

      {showInvite && (
        <div className="bg-gray-900 p-3.5 rounded-lg border border-gray-700 mb-6 shadow-inner transition-all duration-300 ease-in-out">
          <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">Invite Link</p>
          <input 
            type="text" 
            readOnly 
            value={inviteLink}
            className="w-full bg-gray-800 text-gray-300 text-xs p-2.5 rounded border border-gray-700 mb-3 outline-none"
          />
          <div className="flex gap-2">
            <button onClick={copyLink} className="flex-1 bg-gray-700 hover:bg-gray-600 text-sm font-medium text-white py-2 rounded transition-colors">
              Copy
            </button>
            <button onClick={shareLink} className="flex-1 bg-green-600 hover:bg-green-500 text-sm font-medium text-white py-2 rounded transition-colors shadow-lg shadow-green-600/20">
              Share
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4 mt-2">
        <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Online</p>
        <span className="bg-gray-700 text-white text-xs font-bold px-2.5 py-1 rounded-full">{users.length}</span>
      </div>

      <div className="space-y-3 overflow-y-auto flex-1 custom-scrollbar">
        {users.map(user => (
          <div key={user.id} className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: user.color, boxShadow: `0 0 8px ${user.color}` }}
            />
            <span className="text-sm font-medium text-gray-200 truncate">{user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
