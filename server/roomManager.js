const Project = require('./models/Project');
const rooms = {}; // All rooms stored in memory

const COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1",
  "#96CEB4", "#FECA57", "#FF9FF3"
];

let colorIndex = 0;

async function addUser(roomId, socketId, username) {
  if (!rooms[roomId]) {
    let code = "// Start coding here\n";
    let language = "nodejs";

    // If it looks like a MongoDB ObjectId, fetch from DB
    if (roomId.length === 24) {
      try {
        const project = await Project.findById(roomId);
        if (project) {
          code = project.code;
          language = project.language;
        }
      } catch (err) {
        console.error("Error fetching project:", err);
      }
    }

    rooms[roomId] = {
      code,
      language, // JDoodle default
      users: {}
    };
  }

  const color = COLORS[colorIndex % COLORS.length];
  colorIndex++;

  rooms[roomId].users[socketId] = { username, color };
  return color;
}

async function saveProject(roomId) {
  if (roomId.length === 24 && rooms[roomId]) {
    try {
      await Project.findByIdAndUpdate(roomId, {
        code: rooms[roomId].code,
        language: rooms[roomId].language
      });
      // console.log(`Autosaved project ${roomId}`);
    } catch (err) {
      console.error(`Error saving project ${roomId}:`, err);
    }
  }
}

// Periodic autosave every 30 seconds
setInterval(() => {
  for (const roomId in rooms) {
    if (roomId.length === 24 && Object.keys(rooms[roomId].users).length > 0) {
      saveProject(roomId);
    }
  }
}, 30000);

async function removeUser(socketId) {
  for (const roomId in rooms) {
    if (rooms[roomId].users[socketId]) {
      const username = rooms[roomId].users[socketId].username;
      delete rooms[roomId].users[socketId];

      // Clean up empty rooms
      if (Object.keys(rooms[roomId].users).length === 0) {
        await saveProject(roomId);
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
