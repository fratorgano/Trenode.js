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
        partenza: req.body.partenza,
        codicePartenza: req.body.cod_partenza.substr(1), // Rimuovo la prima "S"
        arrivo: req.body.arrivo,
        codiceArrivo: req.body.cod_arrivo.substr(1), // Rimuovo la prima "S"
        data: req.body.data,
        ora: req.body.ora
    };
    req.session.partenza = response.partenza;
    req.session.codicePartenza = response.codicePartenza;
    req.session.arrivo = response.arrivo;
    req.session.codiceArrivo = response.codiceArrivo;
    req.session.data = response.data;
    req.session.ora = response.ora;
    
    response.data += 'T'
    response.ora += ":00"
    response.data += response.ora
    if(response.codicePartenza == undefined||response.codiceArrivo == undefined){
        res.redirect('/errore');
    }
    const soluzioniData = await func.APIRequest(1,response.codicePartenza + '/' + response.codiceArrivo + '/' + response.data);
    if(soluzioniData){
        req.session.soluzioni = soluzioniData;
        res.render(page.slice(1,), soluzioniData);
    }else{
        console.log(new Error('Errore richiesta dati treno (APIRequest 1)'));
        res.redirect('/errore');
    }
    
}); 

module.exports = {
    name: page,
    router: router,
};
