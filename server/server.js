import express from 'express';
import cors from "cors";
import http from "http";
import connectDB from './config/db.js';
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js"
import setupSocket from './socket/socket.js';
const app=express();

app.use(cors());
app.use(express.json());

connectDB();
app.use(express.json());

app.use("/api/users",userRoutes);
app.use("/api/messages",messageRoutes);
app.use("/api/users", userRoutes);


const server=http.createServer(app);

setupSocket(server);



server.listen(5000,()=>{
  console.log(`Server running on port 5000`);
})