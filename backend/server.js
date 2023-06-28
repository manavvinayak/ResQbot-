// imports required for server
import http from "http";
import { Server } from "socket.io";
import express from "express";
import { uniqueNamesGenerator, colors, names } from "unique-names-generator";

// initializing the servers
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const messages = [];

// helper functions
// get all messages in the order they were sent
function getAllMessages() {
  return Array.from(messages).reverse();
}

// generate a unique username for each user
function getUniqueUsername() {
  return uniqueNamesGenerator({
    dictionaries: [names, colors],
    length: 2,
    style: "capital",
    separator: " ",
  });
}

// HTTP server setup to serve the page
app.use(express.static(process.cwd() + "/frontend"));

app.get("/", (req, res) => {
  return res.sendFile(process.cwd() + "/frontend/index.html");
});

// listen for new web socket connections
io.on("connection", (socket) => {
  const username = getUniqueUsername();
  console.log(`${username} connected`);

  // send the chat history to the client
  socket.emit("receive-messages", {
    chatHistory: getAllMessages(),
    username,
  });

  // listen for new messages from the client
  socket.on("post-message", (data) => {
    const { message } = data || { username: "", message: "" };
    messages.push({
      username,
      message,
    });

    // send the updated chat history to all clients
    io.emit("receive-messages", {
      chatHistory: getAllMessages(),
    });
  });

  // listen for disconnects and log them
  socket.on("disconnect", () => {
    console.log(`${username} disconnected`);
  });
});

// start the HTTP server to serve the page
server.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
