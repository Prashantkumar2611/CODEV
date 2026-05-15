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
  socket.on('join-room', ({ roomId, username }) => {
    socket.join(roomId);

    // Add user to room
    const color = roomManager.addUser(roomId, socket.id, username);
    const currentCode = roomManager.getCode(roomId);
    const currentLanguage = roomManager.getLanguage(roomId);
    const users = roomManager.getUsers(roomId);

    // Send current state to the new user
    socket.emit('room-state', { code: currentCode, language: currentLanguage, users });

    // Tell everyone else a new user joined
    socket.to(roomId).emit('user-joined', { userId: socket.id, username, color, users });

    console.log(`${username} joined room ${roomId}`);
  });

  // Someone typed something
  socket.on('code-change', ({ roomId, code }) => {
    roomManager.updateCode(roomId, code);
    // Send to everyone EXCEPT the sender
    socket.to(roomId).emit('code-update', { code });
  });

  // Cursor moved
  socket.on('cursor-change', ({ roomId, position }) => {
    socket.to(roomId).emit('cursor-update', { userId: socket.id, position });
  });

  // Language changed
  socket.on('language-change', ({ roomId, languageId, languageName }) => {
    roomManager.updateLanguage(roomId, languageId);
    socket.to(roomId).emit('language-update', { languageId, languageName });
  });

  // User disconnects
  socket.on('disconnect', () => {
    const info = roomManager.removeUser(socket.id);
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
