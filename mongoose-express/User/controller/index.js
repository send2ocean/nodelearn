'use strict';

module.exports = function (_, $, Auth, Mango) {
    var User           = Mango.User,
        PatientProfile = Mango.PatientProfile;

    var wrapper   = {},
        patchTpls = {
            patient: [
                'bloodType',
                'nickName',
                'birthDate',
                'sex',
                'fullName',
                'city',
                'email'
            ],
            rep: [
                'email'
            ],
            doctor: [
                'jobTitle',
                'avatarImage'
            ]
        };

    function wrapFn(errorType, fn) {
        return function (err, result) {
            if (err) {
                return fn([errorType, err], result);
            }
            fn(null, result);
        };
    }

    function wrapResult(res, next) {
        return function (err, result) {
            res.healthLinkResult = result || {success: true};
            next(err);
        };
    }

    function issueAToken(user) {
        var jwt = Auth.issue({_id: user._id, role: user.role});
        return _.extend(user, {jwt: jwt});
    }

    function buildConnection(targetOptions, selfOptions, callback) {
        var targetRelationPath = targetOptions.relationProperty;
        var selfRelationPath = selfOptions.relationProperty;

        delete targetOptions.relationProperty;
        delete selfOptions.relationProperty;

        $.parallel({
                target: function (callback) {
                    User.findOne(targetOptions, callback);
                },
                self: function (callback) {
                    User.findOne(selfOptions, callback);
                }
            },
            function (err, users) {
                if (!users.target || !users.self) {
                    return callback(['StandardError', 'Related user not found']);
                }

                if (users.self[selfRelationPath].indexOf(users.target._id) !== -1 ||
                    users.target[targetRelationPath].indexOf(users.self._id) !== -1) {
                    return callback(['StandardError', 'Already Connected']);
                }
                users.self[selfRelationPath].push(users.target);
                users.target[targetRelationPath].push(users.self);

                $.map([users.self, users.target], function (user, callback) {
                    user.save(callback);
                }, function (err) {
                    callback(['MongoSaveError', err]);
                });
            });
    }

    wrapper.create = function (role) {
        return function (req, res, next) {
            var user = new User(req.body);
            user.provider = 'local';
            user.role = role;
            user.save(function (err) {
                if (err) {
                    return next(['MongoSaveError', err]);
                }
                if (user.role === 'patient') {
                    var profile = new PatientProfile({owner: user._id});
                    profile.save(function (error) {
                        if (error) {
                            return next(['MongoSaveError', err]);
                        }
                        res.healthLinkResult = issueAToken(user.toJSON());
                        next();
                    });
                } else {
                    res.healthLinkResult = issueAToken(user.toJSON());
                    next();
                }
            });
        };
    };

    wrapper.listRepConnectors = function (req, res, next) {
        User.findById(req.params.repId)
            .populate('serve_doctor')
            .exec(function (err, rep) {
                $.map(rep.serve_doctor, function (doctor, fn) {
                    fn(null, doctor.toJSON());
                }, function (error, doctors) {
                    res.healthLinkResult = doctors;
                    next(['QueryError', err]);
                });
            });
    };

    wrapper.auth = function (req, res, next) {
        res.healthLinkResult = req.user;
        next(null);
    };

    wrapper.remove = function (req, res, next) {
        $.waterfall([
            function (cb) {
                User.findById(req.user._id, wrapFn('QueryError', cb));
            },
            function (user, cb) {
                user.remove(wrapFn('RemoveError', cb));
            }
        ], wrapResult(res, next));
    };

    wrapper.login = function (req, res, next) {
        var handle = {
            patient: 'cellPhone',
            doctor: 'cellPhone',
            rep: 'workNo',
            admin: 'adminNo'
        };

        $.waterfall([
            function (fn) {
                if (req.body && req.body.password && req.body.role && handle[req.body.role] && req.body[handle[req.body.role]]) {
                    var options = {};
                    options[handle[req.body.role]] = {
                        equals: req.body[handle[req.body.role]]
                    };
                    User.modernQuery({
                        properties: options
                    }, fn);
                } else {
                    fn(['StandardError', 'Credential Not found']);
                }
            },
            function (users, fn) {
                if (users.length === 1 && users[0].authenticate(req.body.password)) {
                    fn(null, issueAToken(users[0].toJSON()));
                } else {
                    fn(['StandardError', 'Credential invalid']);
                }
            }
        ], wrapResult(res, next));
    };

    wrapper.serveDoc = function (req, res, next) {
        var doctorId = req.params.doctorIdInEight;
        if (!doctorId) {
            return next(['StandardError', 'Invalid doctorId']);
        }
        buildConnection({
            IDinEight: doctorId,
            relationProperty: 'serve_by_rep'
        }, {
            _id: req.user._id,
            relationProperty: 'serve_doctor'
        }, wrapResult(res, next));
    };

    wrapper.followDoc = function (req, res, next) {
        var doctorId = req.params.doctorIdInEight;
        if (!doctorId) {
            return next(['StandardError', 'Invalid doctorId']);
        }
        buildConnection({
            IDinEight: doctorId,
            relationProperty: 'follow_by_patient'
        }, {
            _id: req.user._id,
            relationProperty: 'follow_doctor'
        }, wrapResult(res, next));
    };

    wrapper.update = function (type) {
        return function (req, res, next) {
            var body     = req.body,
                userId   = req.user._id,
                patchTpl = patchTpls[type];

            if (!body) {
                return next(['StandardError', 'Body is invalid']);
            }

            User.findById(userId, function (err, user) {
                if (err) {
                    return next(['QueryError', err]);
                }
                if (!user) {
                    return next(['StandardError', 'User not found']);
                }

                _.forEach(patchTpl, function (property) {
                    if (body[property]) {
                        user[property] = body[property];
                    }
                });

                user.save(function (err) {
                    res.healthLinkResult = {};
                    next(['MongoSaveError', err]);
                });
            });
        };
    };

    return wrapper;
};
