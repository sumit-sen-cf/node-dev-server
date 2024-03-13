const vari = require("./variables.js");
const express = require("express");
const Socket = require("socket.io");

const app = express();
const server = require("http").createServer(app);

const io = Socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("setup", (userData) => {
    console.log("setup on event calls");
    console.log("userData");
    console.log(userData);
    socket.join(userData._id);
    console.log(userData.name, "connected");
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room: " + room);
  });
  socket.on("new-message", (newMessage) => {
    console.log("new message on event calls");
    console.log("newMessage");
    console.log(newMessage);
    let chat = newMessage.chatIdData;
    if (!chat || !chat.users) {
      return console.log("chat.users not defined");
    }

    chat.users.forEach((user) => {
      if (user._id === newMessage.sender._id) return;
      socket.in(user._id).emit("message received", newMessage);
    });
    socket.on("typing", (room) => {
      socket.in(room).emit("typing");
    });
    socket.on("stop typing", (room) => {
      socket.in(room).emit("stop typing");
    });
  });
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });

});

server.listen(vari.SOCKET_PORT, () => {
  console.log("Socket Server Started, Port : " + vari.SOCKET_PORT);
});