'use strict';

var router = require('./routes');

exports.model = require('./model');

exports.bindTo = function (express, api, Auth, Mango, _, $) {
    var app = express();
    app.use(router(express.Router(), Auth, Mango, _, $));
    api.use(app);
};
