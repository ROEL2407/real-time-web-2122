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

let wordList = [];

app.set("view engine", "ejs");

app.use(express.static(path.resolve("public")));

app.get("/", (req, res) => {
  
  res.render("chat", {
  })
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

  socket.on("newWord", () => {
    fetch(url, options)
      .then(res => res.json())
      .then(data => {
        data.list.forEach(item => {
          if (item.word.indexOf(' ') < 0) {
            if (item.word.indexOf('-') < 0) {
              if (item.word.indexOf('.') < 0) {
              wordList.push({
                word: item.word,
                definition: item.definition
              })
              }
            }
          }
        })
        console.log(wordList)
        let answer = wordList[Math.floor(Math.random() * wordList.length)];
        console.log(answer);
        io.emit("newWord", answer);
      })
      .catch(err => console.error('error:' + err));
  });

  socket.on("winner", () => {
    io.emit("winner")
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

http.listen(port, () => {
  console.log("listening on port ", port);
});
