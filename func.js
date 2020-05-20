const axios = require('axios')

module.exports={
	APIRequest: async function APIRequest(type, parameters){
		switch(type){
			case 1: url = "http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/soluzioniViaggioNew/"; 
				break;
			case 2: url = "http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/cercaNumeroTrenoTrenoAutocomplete/"
				break;
			case 3: url = "http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/andamentoTreno/";
				break;
			case 4: url = "http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/autocompletaStazione/";
				break;
		}
		url += parameters;
		console.log("Requested URL: "+url)
		try {
			const response = await axios.get(url);
			return response.data;
		  } catch (error) {
			console.error(error);
		}

	},
	Epoch: function Epoch(text){
			var dateVal="/Date("+text+")/";
			var date = new Date( parseFloat( dateVal.substr(6 )));
			return(date.getHours()+':'+date.getMinutes);
	}
}
