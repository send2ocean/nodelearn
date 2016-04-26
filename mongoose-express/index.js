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
    app         = express();




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
app.use('/api/v1', api);
Utils.Router.endUpAbove();

var port = process.env.NODE_ENV === 'development' ? 3000 : 4000;
app.listen(3000, function () {
  console.log('Server app listening on port %s!',port);
});


