'use strict';

var express     = require('express'),
    bodyParser  = require('body-parser'),
    path        = require('path'),
    config      = require('config'),
    Utils       = require('./Utils'),
    apiSerivces = [
        require('./User'),       
        require('./HealthData'),      
        require('./Survey') 
    ],
    publicDir   = path.join(__dirname, '../client'),
    api         = express(),
    app         = module.exports = express();




/**************************************************************/
/************* Decode body and url in json format *************/
/**************************************************************/
api.use(bodyParser.json({
    limit: '1mb'
}));
app.use(bodyParser.urlencoded({extended: true}));


/**************************************************************/
/************* Setup utils for all parts of api ***************/
/**************************************************************/
Utils.Mango(config, apiSerivces);
Utils.Auth(config);
Utils.Router(api);


/**************************************************************/
/********** Load the each part of api into the app ************/
/**************************************************************/
Utils._.forEach(apiSerivces, function (service) {
    service.bindTo(express, api, Utils.Auth, Utils.Mango, Utils._, Utils.$, Utils.Socket);
});


/**************************************************************/
/************************* Boot Up ****************************/
/**************************************************************/
//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};

app.use(allowCrossDomain);

app.use('/api/v1', api);
Utils.Router.endUpAbove();

 

Utils.Socket.appendTo(app);

var port = process.env.NODE_ENV === 'development' ? 3000 : 4000;
Utils.Socket.listen(port, '127.0.0.1', function () {
    console.log('PreBaymax Server listens on ' + port);
});
