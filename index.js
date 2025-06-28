const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" }
});

// In-memory storage by room
const messageHistory = {};

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("joinRoom", (room) => {
    socket.join(room);
    if (!messageHistory[room]) messageHistory[room] = [];
    socket.emit("messageHistory", messageHistory[room]);
  });

  socket.on("chatMessage", (data) => {
    const { room } = data;
    if (!messageHistory[room]) messageHistory[room] = [];
    messageHistory[room].push(data);
    io.to(room).emit("chatMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(3001, () => {
  console.log("✅ Server running at http://localhost:3001");
});
