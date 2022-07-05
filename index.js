const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Room = require('./Models/Room/Room');
const { api_url } = require('./config');
const path = require('path');
require('dotenv').config();
// const showdown = require("showdown");
// const passport = require("passport");
// const jwt = require("jwt-simple");
// const LocalStrategy = require("passport-local").Strategy;
// const { admin, admin_password, secret } = require("./config");
// const { v4: uuid } = require("uuid");
const PORT = process.env.PORT || 3001;
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(api_url);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	console.log('connected!!!');
});

// converter = new showdown.Converter();
// converter.setOption("simplifiedAutoLink", "true");

// const servers = ["quill-demo-awareness-room", "asdfasdf"];

// passport.use(
//   new LocalStrategy(function (username, password, done) {
//     if (username === admin && password === admin_password) {
//       done(null, jwt.encode({ username }, secret));
//       return;
//     }
//     done(null, false);
//   })
// );

app.get('/createNew', async (req, res) => {
	const newRoom = new Room({ version: 0 });
	const id = newRoom._id;
	console.log(id);
	await newRoom.save();
	res.json({ id });
});

app.get('/:id', async (req, res) => {
	const id = req.params.id;
	console.log(id);
	let isPresent = false;
	let room;
	try {
		room = await Room.findById(id);
	} catch (err) {
		console.log(err);
		return res.status(404).json({ isPresent });
	}
	if (room) {
		isPresent = true;
		return res.json({ room, isPresent });
	} else return res.json({ isPresent });
});

app.post('/:id', async (req, res) => {
	const body = req.body.text;
	console.log(req.body);
	const id = req.params.id;
	let room;
	try {
		room = await Room.findById(id);
		if (!room) return res.status(404).send();
		room.values.push(body);
		room.version = room.version + 1;
		await room.save();
	} catch (err) {
		console.log(err);
		return res.status(404).json({ isPresent });
	}
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

const server = app.listen(PORT, function () {
	console.log('Server running on port 3001');
});

// const io = require("socket.io")(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//     allowedHeaders: ["my-custom-header"],
//     credentials: true,
//   },
// });
// io.on("connection", (socket) => {
//   console.log("connected user");
//   io.emit("welcome", "server socket");
//   socket.on("addUserToRoom", (userId) => {});
//   socket.on("disconnect", () => {
//     console.log("disconnected");
//   });
// });

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "client", "build")));
  app.get("/*", function (req, res) {
    // this -->
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
});

process.on("uncaughtException", (err, promise) => {
  console.log(`Error: ${err.message}`);
});
