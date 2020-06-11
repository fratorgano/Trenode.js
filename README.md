![trenodeIcon](https://github.com/FrancescoTorgano/Trenode.js/blob/master/images/favicon.ico)
# Trenode.js
Trenode.js is a project I'm working on to give me and my friend an easy way to check italian trains schedule and real time train tracking through Trenitalia API. 
This is my first Javascript/Node project so I'm sure there is a lot of spaghetti code. <br/>
Feel free to contribute! <br/>
Here is the work-in-progress website: [Trenode.tk](http://trenode.tk/)

## Current features
* Search train solutions between two destinations at a certain date and time
* Choosing a solution allows to check the trains status, including trains numbers, platforms and delays
* Autocompleting  date, time(to current ones) and station names in the form
* Fully responsive layout
* Mobile friendly
* Automatic dark mode

## What's new in version 2.0
* Solutions with more than a train now render properly
* Almost completely code rewrite with promises (await and async too)
* Updated layout of all the pages, now fully HTML5 compliant
* Added dark mode
* Removed deprecated package for api requests. Now using [Axios](https://github.com/axios/axios)
* Cleaned up the code a bit
* Removed useless files from the repo (node_modules)
* Status train's page now auto refreshes every minute

## To do list
### Server-side
* Fix spaghetti code
* Add comments
### Client-side
* Fix spaghetti code

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
* [Express-Compresson](https://github.com/expressjs/compression) - Compression Middleware
* [Serve-favicon](https://github.com/expressjs/serve-favicon) - Favicon Middleware
* [Body-Parser](https://github.com/expressjs/body-parser) - Parsing Middleware
* [Path](https://github.com/jinder/path) - Path translator
* [Axios](https://github.com/axios/axios) - Promise based HTTP client for node.js
### Client-side
* [Bootstrap](https://github.com/twbs/bootstrap) - Front-end Framework
* [Autocomplete](https://github.com/kraaden/autocomplete) - Autocomplete form inputs

## License
Trenode.js is released under the MIT License.
