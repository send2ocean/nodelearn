'use strict';

var colors = require('colors');

function setUpPreBayMaxError(_) {

    var PreBayMaxError = {};

    /**
     * Error Generator based on mongoose save function
     * @param {Object} err from mongoose save function
     * @constructor
     */
    PreBayMaxError.MongoSaveError = function (err) {
        this.name = 'Entity Save Error';
        this.stack = (new Error()).stack;
        this.messages = [];
        this.code = 403;

        if (err.errors) {
            for (var x in err.errors) {
                if (err.errors.hasOwnProperty(x)) {
                    this.messages.push({
                        name: err.name,
                        message: err.message,
                        param: x,
                        msg: err.errors[x].message,
                        value: err.errors[x].value
                    });
                }
            }
        } else {
            this.messages.push({
                type: err.name,
                name: err.message
            });
        }
    };

    /**
     *
     * @param messages
     * @constructor
     */
    PreBayMaxError.ParamsError = function (messages) {
        this.name = 'Params Error';
        this.stack = (new Error()).stack;
        this.messages = messages;
        this.code = 403;
    };

    PreBayMaxError.QueryError = function (errFromQuery) {
        this.name = 'Query Error';
        this.stack = (new Error()).stack;
        this.messages = errFromQuery;
        this.code = 403;
    };

    PreBayMaxError.RemoveError = function (errFromRemove) {
        this.name = 'Deletion Error';
        this.stack = (new Error()).stack;
        this.messages = errFromRemove;
        this.code = 403;
    };

    /**
     * StandardError is a string
     * @param {String} message
     * @constructor
     */
    PreBayMaxError.StandardError = function (message) {
        this.name = 'Bad Request';
        this.stack = (new Error()).stack;
        this.messages = message;
        this.code = 403;
    };

    PreBayMaxError.ExpandError = function (errorFromExpand) {
        this.name = 'Expand Error';
        this.stack = (new Error()).stack;
        this.messages = errorFromExpand;
        this.code = 403;
    };

    /**
     *
     * @param messages
     * @constructor
     */
    PreBayMaxError.AuthError = function (messages) {
        this.name = 'Authentication Error';
        this.stack = (new Error()).stack;
        this.messages = messages;
        this.code = 401;
    };

    Error.prototype.toJSON = function () {
        var self = this;
        return {
            code: self.code,
            body: {
                messages: self.messages,
                name: self.name
            }
        };
    };

    _.forOwn(PreBayMaxError, function (value, key) {
        PreBayMaxError[key].prototype = Error.prototype;
    });

    return PreBayMaxError;
}

function printErrorRequest(req, error) {

    console.log(colors.rainbow('\n>>>>>'));
    console.log('At: '.red, JSON.stringify(new Date()).magenta);
    if (req.user) {
        console.log(
            'User: '.red,
            JSON.stringify(req.user, null, 3).blue.bgWhite
        );
    }
    console.log(
        ('Request: ' + req.method).red,
        ('Path: ' + req.path).magenta,
        ('Params: ' + JSON.stringify(req.params) + ' Body: ' + JSON.stringify(req.body, null, 3)).blue.bgWhite
    );
    console.log(
        'Got and error: '.red,
        (error.code + ' ').magenta,
        JSON.stringify(error.body, null, 3).blue.bgWhite
    );
    console.log('<<<<<\n'.rainbow);
}

module.exports = function (_, $, app) {

    var router = {
        PreBayMaxError: setUpPreBayMaxError(_)
    };

    router.endUpAbove = function () {

        //if any error in the next(), this function fired up
        app.use(function (err, req, res, next) {
            var errName, errMessage, HandlerFunc, error;
            if (err) {
                if (_.isArray(err)) {
                    if (!err[0]) {
                        throw new Error('You must define error name in your route functions');
                    }
                    if (!err[1]) {
                        return next();
                    }
                    errName = err[0];
                    errMessage = err[1];
                    HandlerFunc = router.PreBayMaxError[errName];
                    if (!HandlerFunc) {
                        throw new Error('You error type has not been support yet');
                    }
                    error = new HandlerFunc(errMessage);
                } else {
                    HandlerFunc = router.PreBayMaxError.StandardError;
                    error = new HandlerFunc(err.message);
                }
                res.PreBayMaxError = error.toJSON();
            }
            next();
        });
        app.use(function (req, res) {
            var error   = res.PreBayMaxError,
                results = res.PreBayMaxResult;
            if (error) {
                if (process.env.NODE_ENV !== 'test') {
                    printErrorRequest(req, error);
                }
                return res.status(error.code).json(error.body);
            }
            if (results) {
                return res.status(200).json(results);
            }

            res.status(404).json({
                'bayMax': 'Your request has not been built yet :)'
            });
        });
    };

    return router;
};