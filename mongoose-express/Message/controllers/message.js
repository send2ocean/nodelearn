'use strict';

var Message = require('../models/Message');

exports.createMessage = function (req) {

    var message = new Message(req.body);
    message.sender = req.user._id;

    message.save(function (err) {
        if (err) {
            return req.sendError('MongooseSaveError', err);
        } else {
            return req.sendResult(message.toJSON());
        }
    });
};

exports.retrieveMessages = function(){
};
