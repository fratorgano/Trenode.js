/* const express = require('express');
const router = express.Router();
const page = "/soluzioni";

router.get("", (req, res) => {
    res.render("index");
});

module.exports = {
    name: page,
    router: router,
}; */

const express = require('express');
const bodyParser = require('body-parser');
const func = require('../func.js');

const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({
	extended: false,
});

const page = '/soluzioni';

router.get('', (_, res) => {
	res.redirect('/');
});
router.get('/', (_, res) => {
	res.redirect('/');
});

router.post('', urlencodedParser, async function(req, res) {
	const response = {
		partenza: req.body.partenza,
		codicePartenza: req.body.codicePartenza.substr(1),
		arrivo: req.body.arrivo,
		codiceArrivo: req.body.codiceArrivo.substr(1),
		data: req.body.data,
		ora: req.body.ora,
	};

	response.data += 'T';
	response.ora += ':00';
	response.data += response.ora;
	if(response.codicePartenza == undefined || response.codiceArrivo == undefined) {
		res.redirect('/errore');
	}
	const soluzioniData = await func.APIRequest(1, response.codicePartenza + '/' + response.codiceArrivo + '/' + response.data);
	if(soluzioniData) {
		req.session.soluzioni = soluzioniData;
		res.render(page.slice(1), soluzioniData);
	}
	else{
		console.log(new Error('Errore richiesta dati treno (APIRequest 1)'));
		res.redirect('/errore');
	}

});

module.exports = {
	name: page,
	router: router,
};
