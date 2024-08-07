![trenodeIcon](https://raw.githubusercontent.com/fratorgano/Trenode.js/master/public/icon.svg)
# Trenode.js
Trenode.js is a project I'm working on to give me and my friend an easy way to check italian trains schedule and real time train tracking through Trenitalia API. 
This is my first Javascript/Node project so I'm sure there is a lot of spaghetti code. <br/>
Feel free to contribute! <br/>
Here is the website: [Trenode.js](http://trenode.fratorgano.me/)

## Current features
* ~~Search train solutions between two destinations at a certain date and time~~ Trenitalia broke the viaggiatreno APIs that were being used
* ~~Choosing a solution allows to check the trains status, including trains numbers, platforms and delays~~ Trenitalia broke the viaggiatreno APIs that were being used
* Autocompleting  date, time(to current ones) and station names in the form
* Fully responsive layout
* Mobile friendly
* Automatic dark mode
* Page to check timetable of stations for both arrivals and departures
* Push notifications for timetable updates

## What's new in version 2.2
* Officially a web app! Now you can add it to your home screen and use it as a native app
* Added push notifications to the timetable page to get notified about train updates

## What's new in version 2.1
* Fixed bug when Trenitalia provided solutions with some null values
* Added new page to check timetable of stations for both arrivals and departures

## What's new in version 2.0
* Solutions with more than a train now render properly
* Status train's page now automatically refreshes every minute
* Almost completely code rewrite with promises (await and async too)
* Updated layout of all the pages, now fully HTML5 compliant
* Added dark mode
* Removed deprecated package for api requests. Now using [Axios](https://github.com/axios/axios)
* Cleaned up the code a bit
* Removed useless files from the repo (node_modules)

## Known issues
* Viaggiatreno APIs are not always reliable so train status might show the wrong train when checking the real time tracking (especially if checking a train that has not departed yet)

## Try it
If you want to try it on your local machine, you just need to run some simple commands
1. Either download the repo or clone it (git clone https://github.com/fratorgano/Trenode.js)
1. Go to the folder you cloned it to
1. Run the following commands
    1. npm install (Which install all the modules needed, it shouldn't fail but if it does, just run it again)
    1. npm start (Starts the server on localhost:8080)

## Dependencies/Modules Used
### Server-side
* [Node.js](https://github.com/nodejs/node) - Javascript runtime
* [Express](https://github.com/expressjs/express) - Web Framework
* [Express-Compression](https://github.com/expressjs/compression) - Compression Middleware
* [Express-Session](https://github.com/expressjs/session) - Session Middleware
* [Body-Parser](https://github.com/expressjs/body-parser) - Parsing Middleware
* [EJS](https://github.com/mde/ejs) - Embedded JavaScript templates for Express
* [Axios](https://github.com/axios/axios) - Promise based HTTP client for node.js
### Client-side
* [Bootstrap](https://github.com/twbs/bootstrap) - Front-end Framework
* [Autocomplete](https://github.com/kraaden/autocomplete) - Autocomplete form inputs

## License
Trenode.js is released under the MIT License.
