const express = require('express');
const bodyParser = require('body-parser');
const showdown = require('showdown');
const passport = require('passport');
const jwt = require('jwt-simple');
const LocalStrategy = require('passport-local').Strategy;
const { admin, admin_password, secret } = require('./config');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

converter = new showdown.Converter();
converter.setOption('simplifiedAutoLink', 'true');

passport.use(
	new LocalStrategy(function (username, password, done) {
		if (username === admin && password === admin_password) {
			done(null, jwt.encode({ username }, secret));
			return;
		}
		done(null, false);
	})
);

app.get('/', function (req, res) {
	res.send('Hello World!');
});

app.post(
	'/login',
	passport.authenticate('local', { session: false, failWithError: true }),
	function (req, res) {
		res.send('Authenticated');
	}
);

app.post(
	'/convert',
	passport.authenticate('local', { session: false, failWithError: true }),
	function (req, res, next) {
		console.log(req.body);
		if (typeof req.body.content == 'undefined' || req.body.content == null) {
			res.json(['error', 'No data found']);
		} else {
			text = req.body.content;
			html = converter.makeHtml(text);
			console.log(html);
			res.json(['markdown', html]);
		}
	},
	function (err, req, res, next) {
		return res.status(401).send({ success: false, message: err });
	}
);

app.listen(3000, function () {
	console.log('Server running on port 3000');
});
