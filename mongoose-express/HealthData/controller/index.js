'use strict';

module.exports = function (_, $, Mango) {

    var HealthMetaData = Mango.HealthMetaData,
        PatientData    = Mango.PatientData,
        Activity       = Mango.Activity,
        PatientProfile = Mango.PatientProfile;

    function wrapResult(res, next, loggingInfo) {
        return function (err, result) {
            res.healthLinkResult = result || {success: true};
            if (loggingInfo && !err) {
                if (_.isArray(result)) {
                    $.map(result, function (data, cb) {
                        recordActivity(data, loggingInfo, cb);
                    }, function () {
                        next();
                    });
                } else {
                    recordActivity(result, loggingInfo, function () {
                        next();
                    });
                }
            } else {
                next(err);
            }
        };
    }

    function recordActivity(recordData, loggingInfo, cb) {

        function setActionType(recordName, log) {
            switch (recordName) {
                case 'body-temperature':
                    log.actionType = 'temperature';
                    log.icon = {builtInIcon: 'hl:thermometer'};
                    log.summary = recordData.data.body + '℃';
                    break;
                case 'blood-glucose':
                    log.actionType = 'measurement';
                    log.icon = {builtInIcon: 'hl:notifications'};
                    log.summary = 'Measure glucose ' + (recordData.data.body.when.indexOf('after') !== -1 ? 'after meal.' : 'before meal.');
                    break;
                case 'blood-pressure':
                    log.actionType = 'measurement';
                    log.icon = {builtInIcon: 'hl:notifications'};
                    log.summary = 'Measure blood pressure.';
                    break;
                case 'heart-rate':
                    log.actionType = 'measurement';
                    log.icon = {builtInIcon: 'hl:notifications'};
                    log.summary = 'Measure heart rate.';
                    break;
                case 'respiratory-rate':
                    log.actionType = 'measurement';
                    log.icon = {builtInIcon: 'hl:notifications'};
                    log.summary = 'Measure respiratory rate.';
                    break;
                case 'exercise':
                    log.actionType = 'exercise';
                    log.icon = {builtInIcon: 'hl:bike'};
                    log.summary = recordData.data.body.exerciseTime + ' mins.';
                    break;
                case 'treatment':
                    log.actionType = 'treatment';
                    if (recordData.data.body.kind === 'inject') {
                        log.summary = 'Inject ' + recordData.data.body.amount + ' mml of ' + recordData.data.body.medicineName;
                        log.icon = {builtInIcon: 'hl:inject'};
                    }
                    if (recordData.data.body.kind === 'pill') {
                        log.summary = 'Take ' + recordData.data.body.amount + ' pills of ' + recordData.data.body.medicineName;
                        log.icon = {builtInIcon: 'hl:pill'};
                    }
                    break;
                case 'food':
                    log.actionType = 'food';
                    log.icon = {builtInIcon: 'hl:food'};
                    log.summary = recordData.data.body.carbohydrate + 'g carbs.';
                    break;
                case 'rating':
                    log.actionType = 'rating';
                    if (recordData.data.body.selfRatingSleep) {
                        log.actionType = 'sleep';
                        log.icon = {builtInIcon: 'hl:sleep'};
                        log.summary = recordData.data.body.selfRatingSleep.duration + ' hours of sleep.';
                    }
            }
        }

        var extended = {data: recordData};
        extended.visibility = (_.isArray(extended.data) ? extended.data[0].sourceType : extended.data.sourceType) === 'system-test' ? 'system' : 'public';

        setActionType(recordData.data.name, extended);

        loggingInfo = _.extend(loggingInfo, extended);
        var activity = new Activity(loggingInfo);
        activity.save(cb);
    }

    function createRecord(body, user, cb) {
        $.waterfall([
            function (cb) {
                if (!body || !body.data || !body.data.name || !body.data.body) {
                    return cb(['StandardError', 'Invalid Record Body']);
                }
                HealthMetaData.modernQuery({
                    properties: {
                        dataName: {equals: body.data.name}
                    }
                }, function (err, metaData) {
                    if (err) {
                        return cb(['QueryError', err]);
                    }
                    if (!metaData || metaData.length === 0) {
                        return cb(['QueryError', 'Metadata not found']);
                    }
                    var isValid = eval('(function(x){' + metaData[0].validateFunc + '})');
                    if (!isValid(body.data.body)) {
                        return cb(['StandardError', 'Invalid record data']);
                    }
                    body.metaData = metaData[0];
                    body.owner = user;
                    cb(null, body);
                });
            },
            function (body, cb) {
                var dailyRecord = new PatientData(body);
                dailyRecord.save(function (err) {
                    if (err) {
                        return cb(['MongoSaveError', err]);
                    }
                    cb(null, dailyRecord);
                });
            }
        ], cb);
    }

    function returnHealthDataFromHealthProfile(dataCollection, profile) {
        var collection = [];
        _.forEach(dataCollection, function (dataName) {
            var poz = profile.attributeNames.indexOf(dataName);
            if (poz > -1) {
                return collection.push(profile.attributes[poz]);
            }
            collection.push(null);
        });
        return collection;
    }

    function updateAttrInHealthProfile(dataName, body, profile, cbk, addedNotReplace) {
        var poz = profile.attributeNames.indexOf(dataName);
        HealthMetaData.modernQuery({
            properties: {
                dataName: {equals: dataName}
            }
        }, function (err, metaData) {
            if (err) {
                return cbk(['QueryError', err]);
            }
            if (!metaData || metaData.length === 0) {
                return cbk(['QueryError', 'Metadata not found']);
            }
            var validation = metaData[0].validateData(body);
            if (validation.invalid) {
                return cbk(['StandardError', validation.message]);
            }
            if (poz > -1) {
                if (addedNotReplace) {
                    //means this is an array. We must add the new value to this array.
                    profile.attributes[poz].data.push(body);
                } else {
                    profile.attributes[poz].data = body;
                }
                profile.attributes[poz].updatedAt = new Date();
            } else {
                profile.attributeNames.push(dataName);
                profile.attributes.push({
                    meta: metaData[0]._id,
                    data: body
                });
                poz = profile.attributes.length - 1;
            }
            cbk(null, poz);
        });

    }

    return {
        newRecord: function (req, res, next) {
            if (_.isArray(req.body)) {
                $.map(req.body, function (body, fn) {
                    createRecord(body, req.user, fn);
                }, wrapResult(res, next, {
                    owner: req.user._id
                }));
            } else {
                createRecord(req.body, req.user, wrapResult(res, next, {
                    owner: req.user._id
                }));
            }
        },
        listRecords: function (req, res, next) {
            var options = {
                owner: {
                    equals: req.user._id
                },
                'data.name': {
                    equals: req.query.type
                },
                createdAt: {
                    gt: req.query.dateFrom,
                    lt: req.query.dateTo
                }
            };
            PatientData.modernQuery({
                properties: options,
                limit: req.query.limit,
                sort: req.query.sort
            }, function (err, records) {
                res.healthLinkResult = records;
                next(['QueryError', err]);
            });
        },
        createMetaData: function (req, res, next) {
            var metaData = new HealthMetaData(req.body);
            metaData.save(function (err) {
                res.healthLinkResult = metaData;
                next(['MongoSaveError', err]);
            });
        },
        myHealthData: function (req, res, next) {
            PatientProfile.modernQuery({
                properties: {owner: {equals: req.user._id}}
            }, function (err, profile) {
                if (err) {
                    return next(err);
                }
                if (!profile || profile.length === 0) {
                    return next(new Error('User does not have a profile archive.'));
                }
                req.user.healthProfile = profile[0];
                next();
            });
        },
        getSpecifyData: function (req, res, next) {
            var collection = returnHealthDataFromHealthProfile([req.params.dataName], req.user.healthProfile);
            res.healthLinkResult = collection[0] ? collection[0] : {};
            next();
        },
        updateSpecifyData: function (req, res, next) {
            $.waterfall([
                function (fn) {
                    updateAttrInHealthProfile(req.params.dataName, req.body, req.user.healthProfile, fn);
                },
                function (poz, fn) {
                    req.user.healthProfile.save(function (err) {
                        fn(err, req.user.healthProfile.attributes[poz]);
                    });
                }
            ], function (err, data) {
                res.healthLinkResult = data;
                next(err);
            });
        },
        getBodyInfo: function (req, res, next) {
            res.healthLinkResult = returnHealthDataFromHealthProfile(['height', 'weight', 'bodyFat', 'BMIS'], req.user.healthProfile);
            next();
        },
        updateBodyInfo: function (req, res, next) {
            $.waterfall([
                function (fn) {
                    if (!_.isArray(req.body)) {
                        return fn(new Error('Request body is invalid. Must in array format'));
                    }
                    if (req.body.length !== 3) {
                        return fn(new Error('Your request body must have height, weight and body fat.'));
                    }
                    fn(null, req.body);
                },
                function (data, fn) {
                    var BMI = Math.round((data[1] / (data[0] / 100) / (data[0] / 100)) * 100) / 100;
                    $.map([
                        {dataName: 'height', value: data[0]},
                        {dataName: 'weight', value: data[1]},
                        {dataName: 'bodyFat', value: data[2]},
                        {dataName: 'BMIS', value: BMI, added: true}
                    ], function (item, cbk) {
                        updateAttrInHealthProfile(item.dataName, item.value, req.user.healthProfile, cbk, item.added);
                    }, fn);
                },
                function (pozs, fn) {
                    req.user.healthProfile.save(function (err) {
                        if (err) {
                            return fn(err);
                        }
                        $.map(pozs, function (poz, cb) {
                            cb(null, req.user.healthProfile.attributes[poz]);
                        }, fn);
                    });
                }
            ], function (err, data) {
                res.healthLinkResult = data;
                next(err);
            });
        }
    };
};