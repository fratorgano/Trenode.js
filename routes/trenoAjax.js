const express = require('express');
const bodyParser = require('body-parser');

const page = '/trenoAjax';

const router = express.Router();
// Enabling parsing of post data
const urlencodedParser = bodyParser.urlencoded({
	extended: false,
});

// If GET request of domain/trenoAjax and you have a session setup with all the data needed already, it renders the train status page otherwise redirects to the index page
router.get('', (req, res) => {
	console.log(req.session.soluzioni, req.session.nsol);
	if(req.session.soluzioni === undefined || req.session.nsol === undefined) {
		res.redirect('/');
	}
	else{
		res.render('trenoAjax');
	}
});

// If POST request of domain/trenoAjax, renders the page
router.post('', urlencodedParser, async function(req, res) {
	if(req.session.soluzioni == undefined) {
		res.redirect('/errore');
	}
	else{
		try{

			/* const used = process.memoryUsage().rss / 1024 / 1024;
			console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`); */

			// Saving choosen solution in the session
			req.session.nsol = req.body.nsol;

			res.render('trenoAjax');
		}
		catch(error) {
			console.log(error);
			res.redirect('/errore');
		}
	}

});

module.exports = {
	name: page,
	router: router,
};
