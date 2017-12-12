const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const beansroutes_v1 = require('./api/v1/beans.routes.v1');
const barsroutes_v1 = require('./api/v1/bars.routes.v1');
const roastinghouseroutes_v1 = require('./api/v1/roastingHouse.routes.v1');

const mongodb = require('./config/mongo.db');
const config = require('./config/env/env');
const neo4j = require('neo4j-driver').v1;

var app = express();

module.exports = {};


/*
var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "password"));
var session = driver.session();
*/

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', (process.env.PORT || config.env.webPort));
app.set('env', (process.env.ENV || 'development'));

app.use(logger('dev'));

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN || 'http://localhost:4200');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

app.use('/api/v1', beansroutes_v1);
app.use('/api/v1', barsroutes_v1);
app.use('/api/v1', roastinghouseroutes_v1);

// Errorhandler voor express-jwt errors
// Wordt uitgevoerd wanneer err != null; anders door naar next().

app.use(function (err, req, res, next) {
    // console.dir(err);
    var error = {
        message: err.message,
        code: err.code,
        name: err.name,
        status: err.status
    };
    res.status(401).send(error);
});

app.use(function (err, req, res, next) {
    // console.dir(err);
    var error = {
        message: err.message,
        code: err.code,
        name: err.name,
        status: err.status
    };
    res.status(401).send(error);
});

// Fallback - als geen enkele andere route slaagt wordt deze uitgevoerd.
app.use('*', function (req, res) {
    res.status(418);
    res.json({
        'error': 'Deze URL is niet beschikbaar.'
    });
});

app.listen(config.env.webPort, function () {
    console.log('De server luistert op port ' + app.get('port'));
    console.log('Zie bijvoorbeeld http://localhost:3000/api/v1/users');
});

module.exports = app;
