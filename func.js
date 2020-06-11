const axios = require('axios');

module.exports = {
	APIRequest: async function APIRequest(type, parameters) {
		let url;
		switch(type) {
		case 1: url = 'http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/soluzioniViaggioNew/';
			break;
		case 2: url = 'http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/cercaNumeroTrenoTrenoAutocomplete/';
			break;
		case 3: url = 'http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/andamentoTreno/';
			break;
		case 4: url = 'http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/autocompletaStazione/';
			break;
		}
		url += parameters;
		console.log('Requested URL: ' + url);
		try {
			const response = await axios.get(url);
			return response.data;
		}
		catch (error) {
			console.error(error);
		}

	},
	DataEditor: async function DataEditor(soluzioniViaggio, nsol) {
		return new Promise((resolve, reject) => {
			const tr = [];
			if(soluzioniViaggio === undefined) {
				reject(new Error('Could not retrieve session data'));
			}
			let i = 0;
			soluzioniViaggio.soluzioni[nsol].vehicles.forEach(async (vehicle, order) => {
				const ntreno = vehicle.numeroTreno;
				// console.log(ntreno, typeof ntreno);
				if(ntreno != 'Urb') {
					let data = await module.exports.APIRequest(2, ntreno);
					if(data) {
						const limite = data.indexOf('\n');
						data = data.slice(0, limite);
						const inizio = data.lastIndexOf('-') + 1;
						const stazionePartenza = data.slice(inizio, inizio + 6);
						// console.log("QUi "+stazionePartenza+"qui");
						const train = await module.exports.APIRequest(3, stazionePartenza + '/' + ntreno);
						if(train) {
							train.salita = vehicle.origine;
							train.discesa = vehicle.destinazione;
							// console.log(data2.numeroTreno);
							tr[order] = train;
						}
						else{
							reject(new Error('Errore richiesta dati treno (APIRequest 3)'));
						}
					}
					else{
						reject(new Error('Errore autocompletamento treni (APIRequest 2)'));
					}
				}
				else{
					const urb = {
						compNumeroTreno: 'Tragitto Urbano',
						fermate: [{
							stazione: vehicle.origine,
							id: await module.exports.APIRequest(4, vehicle.origine),
						},
						{
							stazione: vehicle.destinazione,
							id: await module.exports.APIRequest(4, vehicle.destinazione),
						}],
						salita: vehicle.origine,
						discesa: vehicle.destinazione,
						oraUltimoRilevamento: 0,
						ritardo: undefined,
					};
					tr[order] = urb;
				}
				if (i == soluzioniViaggio.soluzioni[nsol].vehicles.length - 1) resolve(tr);
				i++;
			});
		});
	},
};
