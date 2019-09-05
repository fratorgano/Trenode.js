var Request=require("request")
var id=-1;
module.exports={
	/* NON piu usata
	Stazione: function Stazione(text){
		return new Promise(function(resolve,reject){
			var url="http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/cercaStazione/";
		url+=text
		//console.log("url:"+url)
		Request.get(url, (error, response, body) => {
		if(error) {
			reject(error);
		}
		resolve(body);
		//console.log(JSON.parse(body));
		})
	})*/
	Soluzione:function Soluzione(text){
		return new Promise(function(resolve,reject){
		var url="http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/soluzioniViaggioNew/"+text;
		console.log("url:"+url)
		Request.get(url, (error, response, body) => {
		if(error) {
			reject(error);
		}
		//console.log(body)
		resolve(body);
		//console.log(JSON.parse(body));
		})
		});
	},
	Partenza: function Partenza(text){
		return new Promise(function(resolve,reject){
		var url="http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/cercaNumeroTrenoTrenoAutocomplete/"+text;
		console.log("url:"+url)
		Request.get(url, (error, response, body) => {
		if(error) {
			reject(error);
		}
		//console.log(body)
		resolve(body);
		//console.log(JSON.parse(body));
		})
	})
	},
	Treno: function Treno(text){
		return new Promise(function(resolve,reject){
		var url="http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/andamentoTreno/"+text;
		console.log("url:"+url)
		Request.get(url, (error, response, body) => {
		if(error) {
			reject(error);
		}
		//console.log(body)
		resolve(body);
		//console.log(JSON.parse(body));
		})
	})
	},
	Epoch: function Epoch(text){
			var dateVal="/Date("+text+")/";
			var date = new Date( parseFloat( dateVal.substr(6 )));
			return(date.getHours()+':'+date.getMinutes);
	}
}
