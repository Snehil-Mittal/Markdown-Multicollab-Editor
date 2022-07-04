const express = require("express");
const bodyParser = require("body-parser");
const showdown = require("showdown");
const passport = require("passport");
const jwt = require("jwt-simple");
const LocalStrategy = require("passport-local").Strategy;
const { admin, admin_password, secret } = require("./config");
const { v4: uuid } = require("uuid");
const cors = require("cors");
const mongoose = require("mongoose");
const Room = require("./Models/Room/Room");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/ColabApp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("connected!!!");
});

// converter = new showdown.Converter();
// converter.setOption("simplifiedAutoLink", "true");

const servers = ["quill-demo-awareness-room", "asdfasdf"];

passport.use(
  new LocalStrategy(function (username, password, done) {
    if (username === admin && password === admin_password) {
      done(null, jwt.encode({ username }, secret));
      return;
    }
    done(null, false);
  })
);

app.get("/createNew", async (req, res) => {
  const newRoom = new Room({ version: 0 });
  const id = newRoom._id;
  console.log(id);
  await newRoom.save();
  res.json({ id });
});

app.get("/:id", async (req, res) => {
  const id = req.params.id;
  let isPresent = false;
  const room = await Room.findById(id);
  if (room) {
    isPresent = true;
    return res.json({ room, isPresent });
  } else return res.json({ isPresent });
});

app.post("/:id", async (req, res) => {
  const body = req.body.text;
  console.log(req.body);
  const id = req.params.id;
  const room = await Room.findById(id);
  if (!room) return res.status(404).send();
  room.values.push(body);
  room.version = room.version + 1;
  await room.save();
  res.send({ success: true });
});

// app.post(
//   "/login",
//   passport.authenticate("local", { session: false, failWithError: true }),
//   function (req, res) {
//     res.send("Authenticated");
//   }
// );

// app.post(
//   "/convert",
//   passport.authenticate("local", { session: false, failWithError: true }),
//   function (req, res, next) {
//     console.log(req.body);
//     if (typeof req.body.content == "undefined" || req.body.content == null) {
//       res.json(["error", "No data found"]);
//     } else {
//       text = req.body.content;
//       html = converter.makeHtml(text);
//       console.log(html);
//       res.json(["markdown", html]);
//     }
//   },
//   function (err, req, res, next) {
//     return res.status(401).send({ success: false, message: err });
//   }
// );

const server = app.listen(3001, function () {
  console.log("Server running on port 3001");
});

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});
io.on("connection", (socket) => {
  console.log("connected user");
  io.emit("welcome", "server socket");
  socket.on("addUserToRoom", (userId) => {});
  socket.on("disconnect", () => {
    console.log("disconnected");
  });
});
