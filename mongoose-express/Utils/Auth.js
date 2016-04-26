'use strict';

var jwt = require('jsonwebtoken');

module.exports = function (_, $, config, mango) {
    if (!config.JWT) {
        throw new Error('Must config jwt setting');
    }
    if (!config.JWT.SECRET) {
        throw new Error('Must config jwt secret setting');
    }
    if (!config.JWT.EXPIRES_TIME) {
        throw new Error('Must config jwt expires time');
    }
    var auth         = {},
        User         = mango.User,
        allowedRoles = [
            'admin',
            'patient',
            'doctor',
            'rep'
        ];

    auth.issue = function (profile) {
        return jwt.sign(profile, config.JWT.SECRET, {
            expiresInMinutes: config.JWT.EXPIRES_TIME
        });
    };
    auth.needA = function (roles) {
        var mustBeIn = roles || allowedRoles;

        return function (req, res, next) {
            var error       = ['AuthError'],
                user,
                jwtFromUser = req.headers.jwt;

            if (jwtFromUser) {
                try {
                    user = jwt.verify(jwtFromUser, config.JWT.SECRET);

                    if (mustBeIn.indexOf(user.role) === -1) {
                        error.push('Permission Denied');
                    }
                } catch (err) {
                    error.push(err.message);
                }
            } else {
                error.push('Token not found');
            }

            if (error.length > 1) {
                return next(error);
            } else {
                User.findById(user._id, function (err, user) {
                    if (err) {
                        error.push(err.message);
                        return next(error);
                    }
                    if (!user){
                        error.push('User not found');
                        return next(error);
                    }
                    if (mustBeIn.indexOf(user.role) === -1) {
                        error.push('Permission Denied');
                        return next(error);
                    }
                    req.user = user.toJSON();
                    if (error.length > 1) {
                        next(error);
                    } else {
                        next(null);
                    }
                });
            }
        };
    };

    return auth;
};
