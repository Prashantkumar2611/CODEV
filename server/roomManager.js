const Project = require('./models/Project');
const rooms = {}; // All rooms stored in memory

const COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1",
  "#96CEB4", "#FECA57", "#FF9FF3"
];

let colorIndex = 0;

async function addUser(roomId, socketId, username, userId) {
  if (!rooms[roomId]) {
    let files = {
      "main.js": { code: "// Start coding here\n", language: "javascript" }
    };

    // If it looks like a MongoDB ObjectId, fetch from DB
    if (roomId.length === 24) {
      try {
        const project = await Project.findById(roomId);
        if (project && project.files) {
          // Convert DB Array to a pure plain JS object
          files = {};
          for (const f of project.files) {
            files[f.filename] = { code: f.code, language: f.language };
          }
        }
      } catch (err) {
        console.error("Error fetching project:", err);
      }
    }

    rooms[roomId] = {
      files,
      users: {}
    };
  }

  // Add as collaborator if not owner (fire and forget, runs even if room is already in memory)
  if (roomId.length === 24 && userId) {
    Project.findById(roomId).then(project => {
      if (project) {
        const isOwner = project.owner.toString() === userId;
        const isCollaborator = project.collaborators.some(id => id.toString() === userId);
        if (!isOwner && !isCollaborator) {
          project.collaborators.push(userId);
          project.save().catch(err => console.error("Error saving collaborator:", err));
        }
      }
    }).catch(err => console.error("Error checking collaborators:", err));
  }

  const color = COLORS[colorIndex % COLORS.length];
  colorIndex++;

  const activeFile = Object.keys(rooms[roomId].files)[0]; // Default to first file
  rooms[roomId].users[socketId] = { username, color, activeFile };
  return color;
}

async function saveProject(roomId) {
  if (roomId.length === 24 && rooms[roomId]) {
    try {
      const filesArray = Object.entries(rooms[roomId].files).map(([filename, data]) => ({
        filename,
        code: data.code,
        language: data.language
      }));
      await Project.findByIdAndUpdate(roomId, {
        files: filesArray
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

function updateCode(roomId, filename, code) {
  if (rooms[roomId] && rooms[roomId].files[filename]) {
    rooms[roomId].files[filename].code = code;
  }
}

function updateActiveFile(roomId, socketId, filename) {
  if (rooms[roomId] && rooms[roomId].users[socketId]) {
    rooms[roomId].users[socketId].activeFile = filename;
  }
}

function createFile(roomId, filename, language) {
  if (rooms[roomId] && !rooms[roomId].files[filename]) {
    rooms[roomId].files[filename] = { code: "", language };
  }
}

function deleteFile(roomId, filename) {
  if (rooms[roomId] && rooms[roomId].files[filename]) {
    delete rooms[roomId].files[filename];
  }
}

function getFiles(roomId) {
  return rooms[roomId]?.files || {};
}

function getUsers(roomId) {
  if (!rooms[roomId]) return [];
  return Object.entries(rooms[roomId].users).map(([id, data]) => ({
    id, ...data
  }));
}

module.exports = {
  addUser, removeUser, updateCode, updateActiveFile,
  createFile, deleteFile, getFiles, getUsers
};
