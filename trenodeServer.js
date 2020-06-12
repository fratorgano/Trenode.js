const express = require('express');
const compression = require('compression');
const session = require('express-session');
const fs = require('fs');

const app = express();

// Enabling middlewares

// Using compression to compress the body of all the requests
app.use(compression());
// Using express-session to implement sessions
app.use(session({
	secret: 'NCpPT3LyxSq5z8n52YPQsVrWvbvyBLSZ',
	name: 'SessionId',
	resave: false,
	// rolling: true,
	saveUninitialized: true,
	// cookie: {
	//    maxAge: 600000
	// }
}));

// Setting parameters for the express app

// Setting path for public files like css and js libraries
app.use('/public', express.static(__dirname + '/public'));
// Setting the engine for handling templates
app.set('view engine', 'ejs');
// Setting the template folder
app.set('views', __dirname + '/views');


// Loading router automatically based on the files in the folder
const routesFiles = fs.readdirSync('./routes').filter(file => file.endsWith('.js'));
for (const file of routesFiles) {
	const route = require('./routes/' + file);
	app.use(route.name, route.router);
}

// Redirects all non-existent page requests to the index
app.use(function(req, res) {
	res.redirect('/');
});

// Activates the server
const server = app.listen(8080, function() {
	const host = server.address().address;
	const port = server.address().port;
	console.log('Treni app listening at http://%s:%s', host, port);
});