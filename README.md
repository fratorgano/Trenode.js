![trenodeIcon](https://github.com/FrancescoTorgano/Trenode.js/blob/master/images/favicon.ico)
# Trenode.js
Trenode.js is a project I'm working on to give me and my friend an easy way to check italian trains schedule and real time train tracking through Trenitalia API. 
This is my first Javascript/Node project so I'm sure there is a lot of spaghetti code. <br/>
Feel free to contribute! <br/>
Here is the work-in-progress website: [Trenode.tk](http://trenode.tk/)

## Current features
* Search train solutions between two destinations at a certain date and time
* Choosing a solution allows to check the train status, including train number, platforms and delay
* Autocompleting  date, time(to current ones) and station names in the form
* Fully responsive layout
## To do list
### Server-side
* Fix spaghetti code
### Client-side
* Fix spaghetti code
* Improve website graphic

## Known issues
* Autocomplete for station names not rendering properly on iOS devices
* Trenitalia API are not always reliable so train status might show the wrong train when checking the real time tracking (especially if checking a train that has not departed yet)

## Dependencies/Modules Used
### Server-side
* [Node.js](https://github.com/nodejs/node) - Javascript runtime
* [Express](https://github.com/expressjs/express) - Web Framework
* [Express-Compresson](https://github.com/expressjs/compression) - Compression Middleware
* [Serve-favicon](https://github.com/expressjs/serve-favicon) - Favicon Middleware
* [Body-Parser](https://github.com/expressjs/body-parser) - Parsing Middleware
* [Path](https://github.com/jinder/path) - Path translator
### Client-side
* [Bootstrap](https://github.com/twbs/bootstrap) - Front-end Framework
* [Autocomplete](https://github.com/kraaden/autocomplete) - Autocomplete form inputs

## License
Trenode.js is released under the MIT License.
