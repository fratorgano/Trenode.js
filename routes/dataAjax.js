const express = require('express');
const func = require('../func.js');
const page = '/dataAjax';

const router = express.Router();

router.get('', async (req, res) => {
	if(req.session.soluzioni === undefined || req.session.nsol === undefined) {
		res.redirect('/');
	}
	else{
		try{
			const tr = await func.DataEditor(req.session.soluzioni, req.session.nsol);
			const used = process.memoryUsage().rss / 1024 / 1024;
			console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
			res.json(tr);
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
