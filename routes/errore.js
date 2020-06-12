const express = require('express');
const router = express.Router();
const page = '/errore';

// Creating a router that renders the page index then the url 'domain/errore' is requested
router.get('', (req, res) => {
	res.render('errore');
});

module.exports = {
	name: page,
	router: router,
};
