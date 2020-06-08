const express = require('express');
const bodyParser = require('body-parser');
const func = require('../func.js')

const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({
    extended: false
});

const page = "/treno";

router.get('', async (req, res) => {
    if(req.session.soluzioni === undefined || req.session.nsol === undefined){
        res.redirect('/');
    }else{
        try{
        const tr = await test(req.session.soluzioni, req.session.nsol)
        const used = process.memoryUsage().rss / 1024 / 1024;
        console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
        res.render('treno', {
            treni: tr
        });
        }catch(error){
            console.log(error);
            res.redirect('/errore');
        }
    }
    
});

router.post('', urlencodedParser, async function (req, res) {
    try{

    const used = process.memoryUsage().rss / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);

    req.session.nsol = req.body.nsol

    const tr = await test(req.session.soluzioni, req.session.nsol)

    res.render('treno', {
        treni: tr
    });
    }catch(error){
        console.log(error);
        res.redirect('/errore');
    }

    /* .then(()=>{
        //WIP, test per eliminare stazioni che non devo percorrere.
        /* for (let index = 0; index < tr.length-1; index++) {
            let limite = -1;
            for (let jndex = 1; jndex < tr[index].fermate.length; jndex++){
                const fermata = tr[index].fermate[jndex];
                //console.log(fermata.stazione +"=="+tr[index+1].fermate[0].stazione.toUpperCase());
                // if(fermata.stazione == tr[index+1].fermate[0].stazione.toUpperCase()){ 
                if(fermata.id == tr[index+1].fermate[0].id){
                    limite = jndex;
                    //console.log("SUCCESSO: "+limite);
                    break;
                }
            }
            
            //console.log(tr[index].fermate);
            //console.log(limite, tr[index+1].fermate[0].stazione.toUpperCase());
            if(limite!=-1){
                tr[index].fermate = tr[index].fermate.slice(0,limite+1);
                //console.log("Sliced index: " + index + " to: " + (limite+1));
            }
        } 
        res.render('treno', {
            treni: tr
        });
    },
    failureReason => {
        console.log(failureReason);
        res.redirect('/errore');
    }); */
}); 

module.exports = {
    name: page,
    router: router,
};

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