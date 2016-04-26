'use strict';

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    async    = require('async'),
    _        = require('lodash');

var attachmentSchema = new Schema({
    fileType: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    }
});

var MessageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    messageBody: {
        type: String,
        required: true
    },
    attachments: [attachmentSchema]
});

// Update & Create
MessageSchema.pre('save', function (next) {
    next();
});

MessageSchema.methods = {

    /**
     * @param expands Expand the child object
     * @param callback Finish
     * @returns {*|Array|Object|Binary}
     */
    toJSON: function (expands, callback) {
        function toObjectWithFields(self) {
            var obj = self.toObject();
            delete obj.__v;
            //remove empty properties
            _.forOwn(obj, function (value, key) {
                if (_.isDate(value)) {
                    return;
                }
                if (_.isNumber(value) && !_.isNaN(value) && _.isFinite(value)) {
                    return;
                }
                if (_.isEmpty(value)) {
                    delete obj[key];
                }
            });
            return obj;
        }

        var self             = this,
            allowedPopFields = {
                sender: 'fullName role',
                receiver: 'fullName role'
            };

        if (!expands && !callback) {
            return toObjectWithFields(self);
        }
        if (!expands && callback) {
            return callback(null, toObjectWithFields(self));
        }
        var expandsArr = JSON.parse(expands);
        async.map(expandsArr, function (expand, fn) {
            Message.populate(self, {
                path: expand,
                select: allowedPopFields[expand]
            }, fn);
        }, function (err) {
            callback(err, toObjectWithFields(self));
        });
    }
};

function ParamsError(message) {
    this.name = 'ParamsError';
    this.message = message;
    this.stack = (new Error()).stack;
}
ParamsError.prototype = Error;

MessageSchema.statics.findByQuery = function (queryObj, fn) {
    var propertiesRule = queryObj.properties,
        fields         = queryObj.fields,
        limit          = queryObj.limit,
        sort           = queryObj.sort ? JSON.parse(queryObj.sort) : null,
        queryCommand   = Message.find();

    _.forOwn(propertiesRule, function (value, key) {
        if (!_.isPlainObject(value)) {
            return fn(new ParamsError('The query for a property must be a object'));
        }
        _.forOwn(value, function (queryValue, rule) {
            if (queryValue === null || queryValue === undefined) {
                return;
            }
            queryCommand.where(key)[rule](queryValue);
        });
    });

    if (limit) {
        queryCommand.limit(limit);
    }
    if (sort) {
        queryCommand.sort(sort);
    }
    if (fields) {
        queryCommand.select(fields);
    }

    queryCommand.exec(fn);
};

var Message;

module.exports = Message = mongoose.model('Message', MessageSchema);