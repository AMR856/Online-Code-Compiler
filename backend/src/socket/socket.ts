import { Server } from "socket.io";
import http from "http";

let io: Server;

export function initSocket(server: http.Server) {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("joinJob", (jobId: string) => {
      console.log(`Client ${socket.id} joined job ${jobId}`);
      socket.join(jobId);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}

export function getIO(): Server {
  if (!io) throw new Error("Socket not initialized");
  return io;
}