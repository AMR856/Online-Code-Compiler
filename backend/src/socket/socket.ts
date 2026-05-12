import { Server } from "socket.io";
import http from "http";

let io: Server;

// Starting SocketIO on an HTTP server
export function initSocket(server: http.Server) {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  // Clinet connection
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Joining a room named after the jobID
    socket.on("joinJob", (jobId: string) => {
      console.log(`Client ${socket.id} joined job ${jobId}`);
      socket.join(jobId);
    });

    // Client disconneting
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}

export function getIO(): Server {
  // This function returns the Socket.IO server instance. It's used in other parts of the application (e.g., the subscriber) to emit events to clients. If the Socket.IO server hasn't been initialized yet, it throws an error to prevent attempts to use an uninitialized server.
  if (!io) throw new Error("Socket not initialized");
  return io;
}