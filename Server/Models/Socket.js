// socket.js
import { Server } from "socket.io";

export const UserSocketMap = {};
export let io;

export const initSocket = (server) => {
  io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log(`User connected: ${userId}`);

    if (userId) {
      UserSocketMap[userId] = socket.id;
    }
    io.emit("onlineUsers", Object.keys(UserSocketMap));

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
      delete UserSocketMap[userId];
      io.emit("onlineUsers", Object.keys(UserSocketMap));
    });

    socket.on("message", (data) => {
      const { receiverId } = data;
      const receiverSocketId = UserSocketMap[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("message", data);
      }
    });
  });
};
