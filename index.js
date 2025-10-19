import express from "express";
import { config } from "dotenv";
import conn from "./config/db.js";
import UserRouter from "./router/User.router.js";
import TaskRouter from "./router/Task.router.js";
import NotificationRouter from "./router/Notification.router.js";
import { Server } from "socket.io";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import cors from "cors";

config();

const app = express();
const server = createServer(app);

conn();

app.use(express.json());
app.use(cookieParser());

const url = "https://taskify-theta-teal.vercel.app";
// const url = ""


const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT"],
  })
);

io.on("connection", (socket) => {
  console.log(`Connected to socket.io: ${socket.id}`);

  socket.on("join", (userId) => {
    console.log("User joining room:", userId);
    socket.join(userId.toString());
  });

  socket.on("leave", (userId) => {
    console.log("User leaving room:", userId);
    socket.leave(userId.toString());
  });
});

app.get("/", (req, res) => {
  res.send("All Good 💀");
});

export { io };

app.use("/api/user", UserRouter);
app.use("/api/notification", NotificationRouter);
app.use("/api/task", TaskRouter);

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
