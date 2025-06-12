// src/lib/socket.ts

import { io, Socket } from "socket.io-client";

// Replace with your backend WebSocket server URL
const URL = import.meta.env.VITE_API_BASE_URL;

// Create and export a single socket instance
export const socket: Socket = io(URL, {
  withCredentials: false, // Optional: if your backend uses cookies
  transports: ["websocket"], // Optional: force WebSocket
});

socket.on("connect", () => {
  console.log("Socket connected");
  socket.emit("init", "KTiger");
});

