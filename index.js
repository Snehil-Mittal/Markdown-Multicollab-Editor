const express = require("express");
const bodyParser = require("body-parser");
const showdown = require("showdown");
const passport = require("passport");
const jwt = require("jwt-simple");
const LocalStrategy = require("passport-local").Strategy;
const { admin, admin_password, secret } = require("./config");
const { v4: uuid } = require("uuid");
const cors = require("cors");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

converter = new showdown.Converter();
converter.setOption("simplifiedAutoLink", "true");

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

app.get("/createNew", (req, res) => {
  const id = uuid();
  console.log(id);
  servers.push(id);
  res.json({ id });
});

app.get("/:id", (req, res) => {
  const id = req.params.id;
  let isPresent = false;
  if (servers.includes(id)) {
    isPresent = true;
  }
  return res.json({ isPresent });
});

app.post(
  "/login",
  passport.authenticate("local", { session: false, failWithError: true }),
  function (req, res) {
    res.send("Authenticated");
  }
);

app.post(
  "/convert",
  passport.authenticate("local", { session: false, failWithError: true }),
  function (req, res, next) {
    console.log(req.body);
    if (typeof req.body.content == "undefined" || req.body.content == null) {
      res.json(["error", "No data found"]);
    } else {
      text = req.body.content;
      html = converter.makeHtml(text);
      console.log(html);
      res.json(["markdown", html]);
    }
  },
  function (err, req, res, next) {
    return res.status(401).send({ success: false, message: err });
  }
);

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
