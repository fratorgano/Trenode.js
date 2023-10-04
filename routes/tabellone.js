const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const router = express.Router();
const page = '/tabellone';

// Creating a router that renders the page index then the url 'domain/' is requested
router.get('', async (req, res) => {
  if(req.query["stazione"] == undefined || req.query["arrivi"] == undefined) {
    res.render('tabellone',
    {
      'stationName': '',
      'trainsData': [],
      'timetableType': '',
      'stationID': ''
    });
  } else {
    const response = await axios({
      method: 'GET',
      headers: { 'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/118.0'},
      url: 'https://iechub.rfi.it/ArriviPartenze/ArrivalsDepartures/Monitor',
      params: {
        'placeId': req.query.stazione,
        'arrivals': req.query.arrivi,
      },
    });
    const html = await response.data;
    // console.log(html)
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
    
    res.render('tabellone',
    {
      'stationName': stationName,
      'trainsData': trainsData,
      'timetableType': req.query.arrivi=='True' ? 'Arrivi':'Partenze',
      'stationID': req.query.stazione
    });
  }
  
});

module.exports = {
	name: page,
	router: router,
};
