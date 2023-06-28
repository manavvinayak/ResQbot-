import http from "http";
import { Server } from "socket.io";
import express from "express";
import { uniqueNamesGenerator, colors, names } from "unique-names-generator";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const messages = [];

function getAllMessages() {
  return Array.from(messages).reverse();
}

function getUniqueName() {
  return uniqueNamesGenerator({
    dictionaries: [names, colors],
    length: 2,
    style: "capital",
    separator: " ",
  });
}

app.use(express.static(process.cwd() + "/frontend"));

app.get("/", (req, res) => {
  return res.sendFile(process.cwd() + "/frontend/index.html");
});

io.on("connection", (socket) => {
  const username = getUniqueName();
  console.log(`${username} connected`);

  socket.emit("receive-messages", {
    chatHistory: getAllMessages(),
    username,
  });

  socket.on("post-message", (data) => {
    const { message } = data || { username: "", message: "" };
    messages.push({
      username,
      message,
    });
    io.emit("receive-messages", {
      chatHistory: getAllMessages(),
    });
  });

  socket.on("disconnect", () => {
    console.log(`${username} disconnected`);
  });
});

server.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
