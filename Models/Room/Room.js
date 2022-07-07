const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
	version: {
		type: Number,
	},
	values: [
		{
			type: String,
		},
	],
});

module.exports = mongoose.model('Room', RoomSchema);
