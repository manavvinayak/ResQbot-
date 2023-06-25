const chat = document.querySelector(".chat");
const chatWindow = document.querySelector(".chat-window");
let chatHistory = [];

const socket = io();

socket.on("receive-messages", (data) => {
  console.log(data);
  const { chatHistory } = data || [];
  render(chatHistory);
});

chat.addEventListener("submit", function (e) {
  e.preventDefault();
  sendMessage(chat.elements.username.value, chat.elements.message.value);
  chat.elements.message.value = "";
});

async function sendMessage(username, message) {
  socket.emit("post-message", {
    username,
    message,
  });
}

function render(chatHistory) {
  const html = chatHistory
    .map(function ({ username, message }) {
      return messageTemplate(username, message);
    })
    .join("\n");
  chatWindow.innerHTML = html;
}

function messageTemplate(username, message) {
  return `<div class="flex items-center">
            <div class="w-5 h-5 bg-green-400 text-white rounded-full flex items-center justify-center mr-2">
              <i class="fas fa-user"></i>
            </div>
        <p class="text-gray-100 text-lg">${username}: ${message}</p>
    </div>
    `;
}
