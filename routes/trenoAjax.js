const express = require('express');
const bodyParser = require('body-parser');

const func = require('../func.js');

const router = express.Router();
const page = '/trenoAjax';


const urlencodedParser = bodyParser.urlencoded({
	extended: false,
});

router.get('', (req, res) => {
	if(req.session.soluzioni === undefined || req.session.nsol === undefined) {
		res.redirect('/');
	}
	else{
		res.render('trenoAjax');
	}
});

router.post('', urlencodedParser, async function(req, res) {
	try{

		const used = process.memoryUsage().rss / 1024 / 1024;
		console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);

		req.session.nsol = req.body.nsol;

		const tr = await func.DataEditor(req.session.soluzioni, req.session.nsol);

		res.render('trenoAjax', {
			treni: tr,
		});
	}
	catch(error) {
		console.log(error);
		res.redirect('/errore');
	}
});

module.exports = {
	name: page,
	router: router,
};
