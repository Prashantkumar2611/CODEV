const rooms = {}; // All rooms stored in memory

const COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1",
  "#96CEB4", "#FECA57", "#FF9FF3"
];

let colorIndex = 0;

function addUser(roomId, socketId, username) {
  if (!rooms[roomId]) {
    rooms[roomId] = {
      code: "// Start coding here\n",
      language: "nodejs", // JDoodle default
      users: {}
    };
  }

  const color = COLORS[colorIndex % COLORS.length];
  colorIndex++;

  rooms[roomId].users[socketId] = { username, color };
  return color;
}

function removeUser(socketId) {
  for (const roomId in rooms) {
    if (rooms[roomId].users[socketId]) {
      const username = rooms[roomId].users[socketId].username;
      delete rooms[roomId].users[socketId];

      // Clean up empty rooms
      if (Object.keys(rooms[roomId].users).length === 0) {
        delete rooms[roomId];
      }
      return { roomId, username };
    }
  }
  return null;
}

function updateCode(roomId, code) {
  if (rooms[roomId]) rooms[roomId].code = code;
}

function updateLanguage(roomId, languageId) {
  if (rooms[roomId]) rooms[roomId].language = languageId;
}

function getCode(roomId) {
  return rooms[roomId]?.code || "// Start coding here\n";
}

function getLanguage(roomId) {
  return rooms[roomId]?.language || "nodejs";
}

function getUsers(roomId) {
  if (!rooms[roomId]) return [];
  return Object.entries(rooms[roomId].users).map(([id, data]) => ({
    id, ...data
  }));
}

module.exports = {
  addUser, removeUser, updateCode,
  updateLanguage, getCode, getLanguage, getUsers
};
