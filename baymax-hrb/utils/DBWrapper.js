'use strict';

var mongoose = require('mongoose'),
    schema = mongoose.Schema;

exports.Schemas = function() {

    var survey = require('../models/survey.js');

    var config = {
        appRoot: __dirname, // required config
        MONGOOSE: {
            URI: 'mongodb://localhost:27017/healthlinkDemo',
            OPTIONS: {
                server: {
                    poolSize: 5,
                    socketOptions: {
                        keepAlive: 1
                    }
                },
                replset: {
                    socketOptions: {
                        keepAlice: 1
                    }
                }
            }
        }
    };
    if (!config.MONGOOSE) {
        throw new Error('Mongoose setting missing');
    }
    if (!config.MONGOOSE.URI) {
        throw new Error('Mongoose uri missing');
    }
    if (!config.MONGOOSE.OPTIONS) {
        throw new Error('Mongoose options missing');
    }
    mongoose.connect(config.MONGOOSE.URI, config.MONGOOSE.OPTIONS);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log('connected to server ...');
    });
    var mango = {};

    survey.call(null,mongo,mongoose,schema);

    return mango;
};
