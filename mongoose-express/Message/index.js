'use strict';

var express           = require('express'),
    messageRoutes = require('./routes/message'),
    app               = express();

exports.bindTo = function (api, Auth) {
    app.use(messageRoutes(Auth));
    api.use(app);
};
