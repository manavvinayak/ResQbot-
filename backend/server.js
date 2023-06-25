import http from "http";
import { Server } from "socket.io";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const messages = [];

function getAllMessages() {
  return Array.from(messages).reverse();
}

app.use(express.static(process.cwd() + "/frontend"));

app.get("/", (req, res) => {
  return res.sendFile(process.cwd() + "/frontend/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.emit("receive-messages", {
    chatHistory: getAllMessages(),
  });

  socket.on("post-message", (data) => {
    const { username, message } = data || { username: "", message: "" };
    messages.push({
      username,
      message,
    });
    io.emit("receive-messages", {
      chatHistory: getAllMessages(),
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
