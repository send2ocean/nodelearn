'use strict';

var express      = require('express'),
    router       = express.Router(),
    messages = require('../controllers/message.js');

module.exports = function (Auth) {

    router.route('/messages')
        .post(function (req) {
            Auth.authenticate(req).success(function () {
                messages.createMessage(req);
            }).error();
        });


    return router;
};
