export default function Sidebar({ users, roomId }) {
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    alert("Room ID copied!");
  };

  return (
    <div className="w-56 bg-gray-800 border-r border-gray-700 p-4 flex flex-col">
      <h2 className="text-lg font-bold mb-1">CollabCode</h2>

      <div className="flex items-center gap-2 mb-6">
        <span className="text-gray-400 text-xs truncate">{roomId}</span>
        <button
          onClick={copyRoomId}
          className="text-xs bg-gray-600 px-2 py-1 rounded hover:bg-gray-500"
        >
          Copy
        </button>
      </div>

      <p className="text-gray-400 text-xs uppercase mb-2">
        Online — {users.length}
      </p>

      <div className="space-y-2">
        {users.map(user => (
          <div key={user.id} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: user.color }}
            />
            <span className="text-sm">{user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
