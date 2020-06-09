const express = require('express');
const func = require('../func.js')
const page = "/dataAjax";

const router = express.Router();

router.get('', async (req, res) => {
    if(req.session.soluzioni === undefined || req.session.nsol === undefined){
        res.redirect('/');
    }else{
        try{
        const tr = await test(req.session.soluzioni, req.session.nsol)
        const used = process.memoryUsage().rss / 1024 / 1024;
        console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
        res.json(tr);
        }catch(error){
            console.log(error);
            res.redirect('/errore');
        }
    }
});
async function test(soluzioniViaggio,nsol){
    return new Promise((resolve, reject) => {
        const tr = [];
        if(soluzioniViaggio === undefined){
            reject(new Error('Could not retrieve session data'));
        }
        let i = 0;
        soluzioniViaggio.soluzioni[nsol].vehicles.forEach(async (vehicle,order) => {
            const ntreno = vehicle.numeroTreno;
            //console.log(ntreno, typeof ntreno);
            if(ntreno!='Urb'){
                let data = await func.APIRequest(2,ntreno);
                const limite = data.indexOf("\n");
                data = data.slice(0,limite);
                const inizio = data.lastIndexOf("-") + 1;
                const stazionePartenza = data.slice(inizio, inizio + 6);
                //console.log("QUi "+stazionePartenza+"qui");
                const train = await func.APIRequest(3, stazionePartenza + "/" + ntreno)
                train.salita = vehicle.origine
                train.discesa = vehicle.destinazione
                //console.log(data2.numeroTreno);
                tr[order] = train;
            }else{
                const urb = {
                    compNumeroTreno: "Tragitto Urbano",
                    fermate: [{
                        stazione: vehicle.origine,
                        id: await func.APIRequest(4,vehicle.origine)
                    },
                    {
                        stazione: vehicle.destinazione,
                        id: await func.APIRequest(4,vehicle.destinazione)
                    }],
                    salita: vehicle.origine,
                    discesa: vehicle.destinazione
                }
                tr[order] = urb;
            }
            if (i === soluzioniViaggio.soluzioni[nsol].vehicles.length-1) resolve(tr);
            i++;
        });
    })
}

module.exports = {
    name: page,
    router: router,
};
