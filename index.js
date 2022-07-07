const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Room = require('./Models/Room/Room');
const { api_url } = require('./config');
const path = require('path');
require('dotenv').config();
const PORT = process.env.PORT || 3001;
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// connecting to mongodb
mongoose.connect(api_url);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	console.log('connected!!!');
});

// creating new room
app.get('/createNew', async (req, res) => {
	const newRoom = new Room({ version: 0 });
	const id = newRoom._id;
	console.log(id);
	await newRoom.save();
	res.json({ id });
});

//getting the room info
app.get('/:id', async (req, res) => {
	const id = req.params.id;
	let isPresent = false; //  checking for existence of room id
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

// storing the room's data
app.post('/:id', async (req, res) => {
	const body = req.body.text;
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

const server = app.listen(PORT, function () {
	console.log('Server running on port 3001');
});

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.resolve(__dirname, 'client', 'build')));
	app.get('/*', function (req, res) {
		// this -->
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`);
});

process.on('uncaughtException', (err, promise) => {
	console.log(`Error: ${err.message}`);
});
