const express = require('express');
const bodyParser = require('body-parser');
const func = require('../func.js');

const router = express.Router();
// Enabling parsing of post data
const urlencodedParser = bodyParser.urlencoded({
	extended: false,
});

const page = '/soluzioni';

// If the page is requested without post data (which means without coming from index and compiling the form), you get redirected to the index page
router.get('', (_, res) => {
	res.redirect('/');
});
/* router.get('/', (_, res) => {
	res.redirect('/');
}); */

// When getting post data, requesting data to the train API for solutions about the train trip and showing them in the page /soluzioni
router.post('', urlencodedParser, async function(req, res) {
	// Getting data from post
	const response = {
		partenza: req.body.partenza,
		codicePartenza: req.body.codicePartenza.substr(1),
		arrivo: req.body.arrivo,
		codiceArrivo: req.body.codiceArrivo.substr(1),
		data: req.body.data,
		ora: req.body.ora,
	};
	// Formatting data for API request
	/* response.data += 'T';
	response.ora += ':00';
	response.data += response.ora; */
	const data = new Date(Date.parse(`${response.data}T${response.ora}:00`))
	if(response.codicePartenza == undefined || response.codiceArrivo == undefined) {
		res.redirect('/errore');
	}
	// Requesting solutions from the API
	const soluzioniData = await func.APIRequest(1, response.codicePartenza + '/' + response.codiceArrivo + '/' + data.toISOString());
	// Rendering solutions in the soluzioni page if the request works properly and saving data in the session
	if(soluzioniData) {
		const soluzioniCorrette = []
		for (const soluzione of soluzioniData.soluzioni) {
			const checkNullDestination = soluzione.vehicles.some((vehicle)=>vehicle.destinazione==null)
			const checkNullOrigin = soluzione.vehicles.some((vehicle)=>vehicle.origine==null)
			if(soluzione.durata && !checkNullDestination && !checkNullOrigin) {
				soluzioniCorrette.push(soluzione)
			}
		}
		soluzioniData.soluzioni = soluzioniCorrette
		req.session.soluzioni = soluzioniData;
		
		res.render(page.slice(1), soluzioniData);
	}
	// Rendering error page if the requests fails.
	else{
		console.log(new Error('Errore richiesta dati treno (APIRequest 1)'));
		res.redirect('/errore');
	}

});

module.exports = {
	name: page,
	router: router,
};
