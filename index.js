const express = require("express");
const app = express();
const http = require("http").createServer(app);
const path = require("path");
const io = require("socket.io")(http);
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const port = process.env.PORT || 4200;

const url = 'https://api.urbandictionary.com/v0/random';

const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Host': 'mashape-community-urban-dictionary.p.rapidapi.com',
    'X-RapidAPI-Key': 'a7685906d1mshf07861808c518c4p1d4ee6jsn758616f5bc0f'
  }
};


app.set("view engine", "ejs");

app.use(express.static(path.resolve("public")));

app.get("/", (req, res) => {
  
  fetch(url, options)
    .then(res => res.json())
    .then(data => {
      let answer = data.list[Math.floor(Math.random() * data.list.length)];
      res.render("chat", {
        word: answer
      })
    })
    .catch(err => console.error('error:' + err));
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on('create', function(room) {
    socket.join(room);
    console.log("user joined room:" + room)
  });

  socket.on("message", (message) => {
    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

http.listen(port, () => {
  console.log("listening on port ", port);
});
