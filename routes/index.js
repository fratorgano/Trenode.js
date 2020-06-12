const express = require('express');
const router = express.Router();
const page = '/';

// Creating a router that renders the page index then the url 'domain/' is requested
router.get('', (req, res) => {
	res.render('index');
});

module.exports = {
	name: page,
	router: router,
};
