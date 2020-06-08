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
const func = require('../func.js')

const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({
    extended: false
});

const page = "/soluzioni";

router.get('', (_, res) => {
    res.redirect('/');
});
router.get('/', (_, res) => {
    res.redirect('/');
});

router.post('', urlencodedParser, async function (req, res) {
    const response = {
        partenza: req.body.cod_partenza.substr(1), // Rimuovo la prima "S"
        arrivo: req.body.cod_arrivo.substr(1), // Rimuovo la prima "S"
        data: req.body.data,
        ora: req.body.ora
    };
    

    response.data += 'T'
    response.ora += ":00"
    response.data += response.ora
    const soluzioniData = await func.APIRequest(1,response.partenza + '/' + response.arrivo + '/' + response.data);

    req.session.soluzioni = soluzioniData;

    res.render(page.slice(1,), soluzioniData);
}); 

module.exports = {
    name: page,
    router: router,
};
