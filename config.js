const dotenv = require('dotenv');
dotenv.config();
module.exports = {
	api_url: process.env.API_URL,
	admin: process.env.ADMIN,
	admin_password: process.env.ADMIN_PASSWORD,
	secret: process.env.SECRET,
};
