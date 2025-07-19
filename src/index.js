import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import express from "express";

// Load environment variables
dotenv.config({ path: "./.env" });

// Create server
const server = http.createServer(app);

// ✅ Serve uploaded files (docs/images/etc.)
app.use("/uploads", express.static(path.join(path.resolve(), "public/temp")));

// ✅ Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  },
});

// ✅ Store connected user sockets
let onlineUsers = {};

// ✅ Socket.IO connection logic
io.on("connection", (socket) => {
  //console.log("New client connected:", socket.id);

  // ➕ Add user to onlineUsers
  socket.on("add-user", (userId) => {
    onlineUsers[userId] = socket.id;
  });

  // ✉️ Handle sending messages
  socket.on("send-msg", (data) => {
    const recipientSocket = onlineUsers[data.to];
    if (recipientSocket) {
      io.to(recipientSocket).emit("msg-receive", {
        message: data.message,
        from: data.from,
      });
    }
  });

  // 📂 Notify recipient that file is being sent
  socket.on("sending-file", ({ to, from }) => {
    const targetSocket = onlineUsers[to];
    if (targetSocket) {
      io.to(targetSocket).emit("file-incoming", { from });
    }
  });

  // 🔌 Handle disconnect
  socket.on("disconnect", () => {
    for (let userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
        break;
      }
    }
    //console.log("Client disconnected:", socket.id);
  });
});

// ✅ Connect to MongoDB and start server
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server is Running at PORT: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB connection Failed", err);
  });
