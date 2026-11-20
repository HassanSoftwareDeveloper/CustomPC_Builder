import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { setNotificationEmitter } from "../services/notificationService.js";

export function initSocket(httpServer, allowedOrigins) {
  const io = new Server(httpServer, {
    cors: { origin: allowedOrigins, credentials: true },
  });

  io.use(async (Socket, next) => {
    try {
      const token = Socket.handshake.auth?.token;
      if (!token) return next(new Error("Please log in first"));
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(id);
      if (!user) return next(new Error("User no longer exists."));

      Socket.data.userId = String(user._id);
      Socket.data.role = user.role;
      next();
    } catch {
      next(new Error("Your session expired. Please log in again."));
    }
  });

  // conection the notifcation service  to live connection brooo

  io.on("connection", (socket) => {
    socket.join(`user: ${socket.data.userId}`);
    if (socket.data.role === "admin") socket.join("admins");
    setNotificationEmitter({
      toUser(userId, event, payload) {
        io.to(`user: ${userId}`).emit(event, payload);
      },
    });
  });
  return io;
}
