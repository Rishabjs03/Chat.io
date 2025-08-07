import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import UserRouter from "./Routes/userRoutes.js";
import messageRouter from "./Routes/messageroutes.js";
import { connectDB } from "./lib/db.js";
import { Server } from "socket.io";

// create express app and http server
const app = express();

// create a new instance of the http server
const server = http.createServer(app);

// Middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());
// create a new instance of socket.io
export const io = new Server(server, {
  cors: { origin: "*" },
});

// store online users
export const UserSocketMap = {};

// handle socket connection
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log(`User connected: ${userId}`);

  if (userId) {
    UserSocketMap[userId] = socket.id;
  }
  //   emit online users to all clients
  io.emit("onlineUsers", Object.keys(UserSocketMap));

  // handle user disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${userId}`);
    delete UserSocketMap[userId];
    io.emit("onlineUsers", Object.keys(UserSocketMap));
  });

  // handle message event
  socket.on("message", (data) => {
    const { receiverId } = data;
    const receiverSocketId = UserSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("message", data);
    }
  });
});

// Routes setup
app.use("/api/status", (req, res) => res.send("Server is running"));
app.use("/api/auth", UserRouter);
app.use("/api/messages", messageRouter);

// Import and connect to the database
await connectDB();
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
