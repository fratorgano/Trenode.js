const express = require('express');
const router = express.Router();
const page = "/";

router.get('', (req, res) => {
    const today = new Date();
    const data = today.toISOString().substr(0,10);
    var ora = today.getHours()<10?'0'+today.getHours():today.getHours();
    ora += today.getMinutes()<10?':0'+ today.getMinutes():':' + today.getMinutes();

    const inputs ={
        partenza: 'Novara (S00248)',
        codicePartenza: 'S00248',
        arrivo: 'Milano Centrale (S01700)',
        codiceArrivo: 'S01700',
        data: data,
        ora: ora,
    }

    if(req.session.partenza && req.session.codicePartenza){
        inputs.partenza = req.session.partenza;
        inputs.codicePartenza = req.session.codicePartenza;
    }
    if(req.session.arrivo && req.session.codiceArrivo){
        inputs.arrivo = req.session.arrivo;
        inputs.codiceArrivo = req.session.codiceArrivo;
    }
    if(req.session.data){
        inputs.data = req.session.data;
    }
    if(req.session.ora){
        inputs.ora = req.session.ora;
    }
    res.render("index", inputs);
});

module.exports = {
    name: page,
    router: router,
};


