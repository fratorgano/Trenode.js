const compression = require('compression');
const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const path = require('path');

const func = require('./func.js')

const app = express();

const limitMemory = 10;
var id = 0;
const cacheSoluzioni = [];
// Create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({
    extended: false
});

// app.use(express.static('public'));
app.use(compression());
app.use('/public', express.static(__dirname + '/public'));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(favicon(path.join(__dirname, 'images', 'favicon.ico')));

app.get("/", (req, res) => {
    res.render("index");
});

app.post('/process_post', urlencodedParser, async function (req, res) {
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
    //Debug thingy
    soluzioniData.errore = String(id);

    CachingSoluzioni(soluzioniData);

    res.render('soluzioni', soluzioniData);

})

app.post('/treno', urlencodedParser, async function (req, res) {
    const response = {
        nsol: req.body.nsol,
        id: req.body.id%limitMemory
    };
    console.log("id usato array: " + response.id);
    //console.log(soluzioni)

    const tr = [];

     var prom = new Promise((resolve, reject) => {
        if(cacheSoluzioni[response.id] === undefined){
            reject("failed to retrieve data")
        }
        let i = 0;
        cacheSoluzioni[response.id].soluzioni[response.nsol].vehicles.forEach(async (vehicle,order) => {
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
            if (i === cacheSoluzioni[response.id].soluzioni[response.nsol].vehicles.length-1) resolve();
            i++;
        });
    });
    

    prom.then(()=>{
        //console.log(tr);

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
        } */
        res.render('treno', {
            treni: tr
        });
    });
});

function CachingSoluzioni(soluzioni) {
    cacheSoluzioni[id%limitMemory] = soluzioni;
    id++;
    console.log("Dimensione cache soluzioni: " + cacheSoluzioni.length);
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
}

var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Treni app listening at http://%s:%s", host, port)
});