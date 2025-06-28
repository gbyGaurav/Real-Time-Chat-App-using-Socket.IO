const socket = io("http://localhost:3001");
const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message");
const notification = document.getElementById("notification");

let username = "";
let avatar = "";
let room = "";

function joinChat() {
  username = document.getElementById("username").value.trim() || "Anonymous";
  avatar = document.getElementById("avatar").value.trim() || "https://i.pravatar.cc/150?u=" + username;
  room = document.getElementById("room").value;

  socket.emit("joinRoom", room);

  document.getElementById("login-box").classList.add("hidden");
  document.getElementById("chat-box").classList.remove("hidden");
  document.querySelector(".input-area").classList.remove("hidden");
}

socket.on("messageHistory", (messages) => {
  chatBox.innerHTML = "";
  messages.forEach(msg => appendMessage(msg));
});

socket.on("chatMessage", (msg) => {
  appendMessage(msg);
  notification.play();
});

function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;

  const msgData = {
    username,
    avatar,
    message,
    room,
    time: new Date().toLocaleTimeString()
  };

  socket.emit("chatMessage", msgData);
  messageInput.value = "";
}

function appendMessage(data) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message");

  msgDiv.innerHTML = `
    <img src="${data.avatar}" />
    <div class="message-content">
      <b>${data.username}</b> <small>${data.time}</small><br/>
      ${data.message}
    </div>
  `;

  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function addEmoji() {
  messageInput.value += "😊";
}
