import { Server } from "socket.io";

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("sendMessage", (data) => {
      console.log("Message received:", data);

      socket.broadcast.emit("receiveMessage", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

export default setupSocket;