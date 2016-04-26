'use strict';

var auth        = require('./Auth'),
    routeHelper = require('./RouteHelper'),
    mongoDB     = require('./DBWrapper'),
    socket      = require('./Socket'),
    sharedLibs  = [require('lodash'), require('async')];

exports._ = sharedLibs[0];
exports.$ = sharedLibs[1];

exports.Auth = function (config) {
    exports.Auth = auth.apply(null, sharedLibs.concat([config, exports.Mango]));
};
exports.Router = function (expressApp) {
    exports.Router = routeHelper.apply(null, sharedLibs.concat([expressApp]));
};
exports.Mango = function (config, modelDefinitions) {
    exports.Mango = mongoDB.apply(null, sharedLibs.concat([config, modelDefinitions]));
};
exports.Socket = socket.apply(null, sharedLibs);
