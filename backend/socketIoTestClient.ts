import { io } from "socket.io-client";

const socket = io("http://localhost:3000");
// const CHANNEL = "job_updates";

socket.on("connect", () => {
  console.log("Connected:", socket.id);

  socket.emit("joinJob", "65525b71-6c1c-40f4-9a2e-635de980f020");
});

socket.on("jobUpdate", (data) => {
  console.log("Update:", data);
});