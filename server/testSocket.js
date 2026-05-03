import { io } from "socket.io-client";

console.log("Starting socket test...");

const socket = io("http://localhost:5000",{
    transports: ["websocket"]
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);

  socket.emit("sendMessage", {
    text: "Hello real-time!"
  });
  
});

socket.on("connect_error", (err) => {
  console.log("Connection error:", err.message);
});

socket.on("receiveMessage", (data) => {
  console.log("Received:", data);
});