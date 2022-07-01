const Request = require('request');
const { api_url } = require('./config');

var textToConvert = `Heading
=======
## Sub-heading
 
Paragraphs are separated
by a blank line.
 
Two spaces at the end of a line  
produces a line break.
 
Text attributes _italic_, 
**bold**, 'monospace'.
A [link](https://example.com).
Horizontal rule:`;

Request.post(
	{
		headers: { 'content-type': 'application/json' },
		url: api_url,
		body: JSON.stringify({
			content: textToConvert,
			username: 'admin',
			password: 'password123',
		}),
	},
	function (error, response, body) {
		// If we got any connection error, bail out.
		if (error) {
			return console.log(error);
		}
		// Else display the converted text
		console.dir(JSON.parse(body));
	}
);
