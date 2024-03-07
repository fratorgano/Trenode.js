const express = require('express');
const func = require('../func.js');

const router = express.Router();
const page = '/tabellone';

// function to pass values in a variable
function passValue(value) {
  return 'JSON.parse(atob("' + Buffer.from(JSON.stringify(value)).toString('base64') + '"))'
}

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
    let timetableData = await func.TimetableRequest(req.query.stazione, req.query.arrivi);
    
    res.render('tabellone',
    {
      'stationName': timetableData.stationName,
      'trainsData': timetableData.trainsData,
      'encodedTrainsData': passValue(timetableData.trainsData),
      'timetableType': req.query.arrivi=='True' ? 'Arrivi':'Partenze',
      'stationID': req.query.stazione
    });
  }
  
});

module.exports = {
	name: page,
	router: router,
};
