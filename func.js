const axios = require('axios');

// Creating a module for functions useful in routes to help keep the code clean and tidy
module.exports = {
	// Function used for requesting data from the viaggiatreno API
	APIRequest: async function APIRequest(type, parameters) {
		let url;
		// Setting url based on the type of the request
		switch(type) {
		// Url for requesting solutions between two station at a certain time and date
		case 1: url = 'http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/soluzioniViaggioNew/';
			break;
		// Url for requesting the departure train station with the train number
		case 2: url = 'http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/cercaNumeroTrenoTrenoAutocomplete/';
			break;
		// Url for requesting data about how the train is going: delays, platforms,...
		case 3: url = 'http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/andamentoTreno/';
			break;
		// Url for requesting autocompleting of the station name (Used only for urb trains)
		case 4: url = 'http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/autocompletaStazione/';
			break;
		}
		// Adding parameters to the url
		url += parameters;
		console.log('Requested URL: ' + url);
		// Requesting data
		try {
			const response = await axios.get(url);
			return response.data;
		}
		catch (error) {
			console.error(error);
		}

	},
	// Function used to prepare data for the trenoAjax and dataAjax page
	DataEditor: async function DataEditor(soluzioniViaggio, nsol) {
		return new Promise((resolve, reject) => {
			const tr = [];
			if(soluzioniViaggio === undefined) {
				reject(new Error('Could not retrieve session data'));
			}
			let i = 0;
			// itering over every train in the solution choosen by the user
			soluzioniViaggio.soluzioni[nsol].vehicles.forEach(async (vehicle, order) => {
				const ntreno = vehicle.numeroTreno;
				// If the train is not 'Urb' we ask the API for more data about it specifically like train times, delays and stations
				// Paying really close attention to not mess up the order of vehicles cause it would render the page wrong while keeping the function async
				if(ntreno != 'Urb') {
					let data = await module.exports.APIRequest(2, ntreno);
					if(data) {
						const limite = data.indexOf('\n');
						data = data.slice(0, limite);
						const inizio = data.lastIndexOf('|') + 1;
						const stazionePartenza = data.slice(inizio);
                                                const splitted = stazionePartenza.split("-");
						const train = await module.exports.APIRequest(3, splitted[1] + '/' + splitted[0] + '/' + splitted[2]);
						if(train) {
							train.salita = vehicle.origine;
							train.discesa = vehicle.destinazione;
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
				// If the train is 'Urb' which means local transport like subway we can't ask info about it so we just provide the info that we got departure and arrival.
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
