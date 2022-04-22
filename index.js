const express = require("express");
const app = express();
const http = require("http").createServer(app);
const path = require("path");
const io = require("socket.io")(http);
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const port = process.env.PORT || 4200;

const url = 'https://mashape-community-urban-dictionary.p.rapidapi.com/define?term=wat';

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
  res.render("chat", {});
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("message", (message) => {
    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

fetch(url, options)
	.then(res => res.json())
	.then(json => console.log(json))
	.catch(err => console.error('error:' + err));

http.listen(port, () => {
  console.log("listening on port ", port);
});
