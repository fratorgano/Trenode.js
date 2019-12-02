var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var func = require('./func.js')
var favicon = require('serve-favicon');
var path = require('path');

var id=0;
var oggetti=new Array;
// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// app.use(express.static('public'));
app.use('/public', express.static(__dirname +'/public'));
app.set("view engine", "ejs"); 
app.set("views", __dirname + "/views");
app.use(favicon(path.join(__dirname, 'images', 'favicon.ico')));

app.get("/", (req, res) => { 
   res.render("index");
 }); 

app.post('/process_post', urlencodedParser, function (req, res) {
   response = {
	  partenza:	req.body.cod_partenza.substr(1), // Rimuovo la prima "S"
	  arrivo:	req.body.cod_arrivo.substr(1), 	 // Rimuovo la prima "S"
	  data:		req.body.data,
	  ora:		req.body.ora
   };
   /* var inizio=response.partenza.indexOf("(")+2
   var fine=response.partenza.indexOf(")")
   response.partenza=response.partenza.slice(inizio,fine)
   var inizio=response.arrivo.indexOf("(")+2
   var fine=response.arrivo.indexOf(")")
   response.arrivo=response.arrivo.slice(inizio,fine) */
   response.data+='T'
   response.ora+=":00"
   response.data+=response.ora
   var promSoluzione=func.Soluzione(response.partenza+'/'+response.arrivo+'/'+response.data)
   promSoluzione.then(
	   function(data){
		   soluzioni=JSON.parse(data);
		   soluzioni.errore=String(id);
		   //console.log(soluzioni.errore)
		   SaveData(soluzioni);
		   res.render('soluzioni',soluzioni);
		},
	   function(error){
		   console.log(error.message);
		   res.render('errore');
	   });
})
app.post('/treno',urlencodedParser,function(req,res){
	response={
		nsol:req.body.nsol,
		id:req.body.id
	};
	console.log("id usato array: "+response.id);
	var ntreno=oggetti[response.id].soluzioni[response.nsol].vehicles[0].numeroTreno;
	var promPartenza=func.Partenza(ntreno)
   	promPartenza.then(
	   function(data){
		   partenza=data;
		   inizio=data.indexOf("-",7)+1;
		   stazionePartenza=data.slice(inizio,inizio+6);
		   //console.log("QUi "+stazionePartenza+"qui");
		   var promTreno=func.Treno(stazionePartenza+"/"+ntreno);
  		   promTreno.then(
	   		function(data){
		   treno=JSON.parse(data);
		   //console.log(treno);
		   res.render('treno',treno)
		},
	   function(error){
		   console.log(error.message);
	   });
		},
	   function(error){
		   console.log(error.message);
	   });
})

function SaveData(data){
	oggetti[id]=data;
	id++;
	console.log(oggetti.length);
}

var server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Treni app listening at http://%s:%s", host, port)
});
