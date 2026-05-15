const express = require('express');
const http = require('http');
require('dotenv').config();
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const roomManager = require('./roomManager');
const { runCode } = require('./codeRunner');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Allow any frontend (like Vercel)
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected successfully!'))
  .catch(err => console.error('MongoDB Connection Error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// REST endpoint to run code
app.post('/run-code', async (req, res) => {
  const { code, languageId } = req.body;
  try {
    const output = await runCode(code, languageId);
    res.json({ output });
  } catch (err) {
    res.json({ output: "Error: " + err.message });
  }
});

// Socket.io — real-time logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User joins a room
  socket.on('join-room', async ({ roomId, username, token }) => {
    socket.join(roomId);

    let userId = null;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (err) {}
    }

    // Add user to room
    const color = await roomManager.addUser(roomId, socket.id, username, userId);
    const files = roomManager.getFiles(roomId);
    const users = roomManager.getUsers(roomId);

    // Send current state to the new user
    socket.emit('room-state', { files, users });

    // Tell everyone else a new user joined
    socket.to(roomId).emit('user-joined', { userId: socket.id, username, color, users });

    console.log(`${username} joined room ${roomId}`);
  });

  // Someone typed something in a file
  socket.on('code-change', ({ roomId, filename, code }) => {
    roomManager.updateCode(roomId, filename, code);
    // Send to everyone EXCEPT the sender
    socket.to(roomId).emit('code-update', { filename, code });
  });

  // Cursor moved in a file
  socket.on('cursor-change', ({ roomId, filename, position }) => {
    socket.to(roomId).emit('cursor-update', { userId: socket.id, filename, position });
  });

  // User switched active file
  socket.on('active-file-change', ({ roomId, filename }) => {
    roomManager.updateActiveFile(roomId, socket.id, filename);
    const users = roomManager.getUsers(roomId);
    io.to(roomId).emit('user-joined', { users }); // Broadcast updated users list so everyone knows who is on what file
  });

  // Create new file
  socket.on('create-file', ({ roomId, filename, language }) => {
    const creator = roomManager.createFile(roomId, socket.id, filename, language);
    io.to(roomId).emit('file-created', { filename, language, creator });
  });

  // Delete file
  socket.on('delete-file', ({ roomId, filename }) => {
    roomManager.deleteFile(roomId, filename);
    io.to(roomId).emit('file-deleted', { filename });
  });

  // Change language
  socket.on('language-change', ({ roomId, filename, language }) => {
    roomManager.updateFileLanguage(roomId, filename, language);
    socket.to(roomId).emit('language-change', { filename, language });
  });

  // User disconnects
  socket.on('disconnect', async () => {
    const info = await roomManager.removeUser(socket.id);
    if (info) {
      const users = roomManager.getUsers(info.roomId);
      io.to(info.roomId).emit('user-left', {
        username: info.username,
        users
      });
    }
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
