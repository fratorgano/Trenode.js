const axios = require('axios');
const cheerio = require('cheerio');

let lastData = {};

// Creating a module for functions useful in routes to help keep the code clean and tidy
module.exports = {
	// Function used for requesting data from the viaggiatreno API
	APIRequest: async function APIRequest(type, parameters) {
		let url;
		// Setting url based on the type of the request
		switch(type) {
		// Url for requesting solutions between two station at a certain time and date
		case 1: url = 'http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/soluzioniViaggioNew/';
			break;
		// Url for requesting the departure train station with the train number
		case 2: url = 'http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/cercaNumeroTrenoTrenoAutocomplete/';
			break;
		// Url for requesting data about how the train is going: delays, platforms,...
		case 3: url = 'http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/andamentoTreno/';
			break;
		// Url for requesting autocompleting of the station name (Used only for urb trains)
		case 4: url = 'http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/autocompletaStazione/';
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
	TimetableRequest: async function TimetableRequest(station, isArrival) {
		const response = await axios({
      method: 'GET',
      headers: { 'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/118.0'},
      url: 'https://iechub.rfi.it/ArriviPartenze/ArrivalsDepartures/Monitor',
      params: {
        'placeId': station,
        'arrivals': isArrival,
      },
    });
		let cachedData = lastData[station+isArrival];
		if (cachedData != null && cachedData.timestamp > Date.now() - 15000) {
			console.log('Using cached data')
			return cachedData.data;
		}
    const html = await response.data;
    const $ = cheerio.load(html);
    const stationName = $('h1#nomeStazioneId').text().trim().toLowerCase().replace(/\b\w/g, match => match.toUpperCase());
    const allRows = $('table#monitor.monitors > tbody > tr');
    const trainsData = []
    for (const row of allRows) {
      const tds = $(row).find('td');
      const trainCode = String(tds[2].children[0].data).trim()
      if(trainCode.length>0){
        const trainOperator = tds[0].children[1].attribs.alt.toLowerCase().replace(/\b\w/g, match => match.toUpperCase());
        // const trainCategory = tds[1]
        const trainDestination = String(tds[3].children[1].children[0].data).trim().toLowerCase().replace(/\b\w/g, match => match.toUpperCase());
        const trainTime = String(tds[4].children[0].data).trim()
        const trainDelay = String(tds[5].children[0].data).trim()
        const trainDelayDisplay = trainDelay == 'Cancellato' ? '❌':trainDelay
        const trainPlatform =  String(tds[6].children[1].children[0].data).trim()
        const trainLeaving = tds[7].children[0].next == null ?false:true
        const trainStops = tds[8].children[3] ? String(tds[8].children[3].children[5].children[0].data).trim().toLowerCase().replace(/\b\w/g, match => match.toUpperCase()):"";
        const trainAdditionalInfo = tds[8].children[3] ? String(tds[8].children[3].children[9]?tds[8].children[3].children[9].children[0].data:"").trim().toLowerCase().replace(/\b\w/g, match => match.toUpperCase()): "";
        const train = {
          'operator': trainOperator,
          'code': trainCode,
          'destination': trainDestination,
          'departureTime': trainTime,
          'delay': trainDelayDisplay,
          'platform': trainPlatform,
          'isLeaving': trainLeaving,
          'stops': trainStops,
          'additionalInfo': trainAdditionalInfo
        }
        trainsData.push(train)
      }
		}
		lastData[station+isArrival] = {timestamp: Date.now(), data: {stationName, trainsData}};
		return {stationName, trainsData};
	}
};
