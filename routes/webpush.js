const express = require('express');
const router = express.Router();
const page = '/webpush';

const webpush = require('web-push');
const dotenv = require('dotenv')
dotenv.config()

const func = require('../func.js');

let subscribers = [];

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_MAILTO}`,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

// Triggers a push notification, debugging purposes
router.get('', (req, res) => {
  console.log('Debug push notification triggered');
  for (const subscriber of subscribers) {
    console.log('Subscriber: '+JSON.stringify(subscriber));
    webpush.sendNotification(subscriber.subscription, JSON.stringify({title: 'DEBUG', body: 'DEBUGDEBUGDEBUGDEBUGDEBUG'}))
  }
  res.sendStatus(200);
});

// Automatically check if there is an update every 30 seconds
let lastData = {}; 
setInterval(async () => {
  let newLastData = {};
  // Get the data
  for (const subscriber of subscribers) {
    let get_info = subscriber.get_info;
    console.log('Checking for updates of: '+JSON.stringify(get_info));
    console.log('Trains to check: '+subscriber.followedTrains);
    if(subscriber.followedTrains.length === 0) {
      console.log('No trains to check');
      continue;
    }
    // download the data 
    if (newLastData[get_info.stazione+get_info.arrivi] === undefined) {
      console.log('Downloading new data')
      newLastData[get_info.stazione+get_info.arrivi] = await func.TimetableRequest(get_info.stazione,get_info.arrivi);
    }
    let newData = newLastData[get_info.stazione+get_info.arrivi]
    
    let related_old_data = lastData[get_info.stazione+get_info.arrivi];
    if(related_old_data === undefined) {
      lastData[get_info.stazione+get_info.arrivi] = newData;
      continue;
    }
    // check if the train being watched has changed
    for (let train of newData.trainsData) {
      if(subscriber.followedTrains.includes(train.code)) {
        // check if the train has changed
        let oldTrain = related_old_data.trainsData.find(t => t.code === train.code);
        // console.log('Old train: '+JSON.stringify(oldTrain));
        // console.log('New train: '+JSON.stringify(train));
        if(oldTrain !== undefined) {
          if(oldTrain.delay !== train.delay) {
            console.log('Train delay has changed');
            if(train.delay == 'Cancellato') {
              webpush.sendNotification(subscriber.subscription, JSON.stringify({title: `Status update - Train ${train.code}`, body: `Train ${train.code} has been cancelled`}))
            } else {
              webpush.sendNotification(subscriber.subscription, JSON.stringify({title: `Delay update - Train ${train.code}`, body: `Train ${train.code} has a new delay of ${train.delay} minutes`}))
            }
          }
          if(oldTrain.platform !== train.platform) {
            console.log('Train platform has changed');
            webpush.sendNotification(subscriber.subscription, JSON.stringify({title: `Platform update - Train ${train.code}`, body: `Train ${train.code} has changed platform to ${train.platform}`}))
          }
          if (oldTrain.isLeaving !== train.isLeaving) {
            console.log('Train is arriving/leaving');
            let verb = get_info.arrivi=='True' ? 'arriving at' : 'leaving';
            webpush.sendNotification(subscriber.subscription, JSON.stringify({title: `Status update - Train ${train.code}`, body: `Train ${train.code} is ${verb} the station`}))
          }
        }
      }
    }
    // clean train list of subscriber
    let newFollowedTrains = [];
    for (let train of subscriber.followedTrains) {
      if(newData.trainsData.find(t => t.code === train) !== undefined) {
        newFollowedTrains.push(train);
      } else {
        console.log('Tracked train '+train+' has been removed because it is not on the list anymore (left or arrived)');
        let verb = get_info.arrivi=='True' ? 'arrived at' : 'left';
        webpush.sendNotification(subscriber.subscription, JSON.stringify({title: `Status update - Train ${train}`, body: `Train ${train} ${verb} the station`}))
      }
    }
    subscriber.followedTrains = newFollowedTrains;
    newLastData[get_info.stazione+get_info.arrivi] = newData;
  }
  lastData = newLastData;


  /* if(subscribers.length > 0){
    for (const subscriber of subscribers) {
      console.log('Subscriber: '+JSON.stringify(subscriber));
      webpush.sendNotification(subscriber.subscription, JSON.stringify({title: 'Train update', body: 'Train update'}))
    }
  } */
}, 30_000);

// An endpoint to save the subscription data
router.post('', (req, res) => {
  // check if the subscription is already saved
  let alreadySaved = false;
  for (const subscriber of subscribers) {
    if (JSON.stringify(subscriber.subscription) === JSON.stringify(req.body.subscription)) {
      // update the subscription
      subscriber.subscription = req.body.subscription;
      subscriber.followedTrains = req.body.followedTrains;
      subscriber.get_info = req.body.get_info;
      alreadySaved = true;
      break;
    }
  }
  if (!alreadySaved) {
    // save the subscription
    subscribers.push(req.body);
  }
  for (const subscriber of subscribers) {
    console.log('Subscriber follows '+subscriber.followedTrains+' for '+ JSON.stringify(subscriber.get_info));
  }
  
  res.sendStatus(200);
});

module.exports = {
	name: page,
	router: router,
};
