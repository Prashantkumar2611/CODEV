import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SERVER_URL, {
  autoConnect: false // Connect manually when needed
});

export default socket;
