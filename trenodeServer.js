const express = require('express');
const compression = require('compression');
const session = require('express-session')
const bodyParser = require('body-parser');
const fs = require('fs');
//const favicon = require('serve-favicon');

const app = express();

// app.use(express.static('public'));
app.use(compression());
app.use('/public', express.static(__dirname + '/public'));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
//app.use(favicon(path.join(__dirname, 'images', 'favicon.ico')));
app.use(session({
    secret: 'NCpPT3LyxSq5z8n52YPQsVrWvbvyBLSZ',
    name: 'SessionId',
    resave: false,
    rolling: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 600000
    }
}))

const routesFiles = fs.readdirSync('./routes').filter(file => file.endsWith('.js'));

for (const file of routesFiles) {
    const route = require('./routes/' + file);
    console.log(file, route.name)
    app.use(route.name, route.router);
}

//Redirects all non-existent page requests to the index
app.use(function(req, res) {
    res.redirect('/');
  });

const server = app.listen(8080, function () {
    const host = server.address().address
    const port = server.address().port
    console.log("Treni app listening at http://%s:%s", host, port)
});