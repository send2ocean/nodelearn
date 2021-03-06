'use strict';

module.exports = function (_, $, Mango) {

    var Question        = Mango.Question,
        SurveyPrototype = Mango.SurveyPrototype,
        HealthMetaData  = Mango.HealthMetaData,
        Survey          = Mango.Survey,
        PatientProfile  = Mango.PatientProfile;

    function getOnesAnswers(userId, fn) {
        Survey.modernQuery({
            properties: {
                participant: {equals: userId}
            }
        }, function (err, answers) {
            if (err) {
                return fn(['QueryError', err]);
            }
            $.each(answers, function (answer, cb) {
                answer.populate('prototypeId', function (err) {
                    cb(err);
                });
            }, function (err) {
                fn(err, answers);
            });
        });
    }

    return {
        createQuestion: function (req, res, next) {
            var question = new Question(_.extend(req.body, {creator: req.user._id}));
            question.save(function (err) {
                if (err) {
                    return next(['MongoSaveError', err]);
                }
                res.PreBayMaxResult = question;
                next();
            });
        },
        createSurveyPrototype: function (req, res, next) {
            var surveyPrototype = new SurveyPrototype(_.extend(req.body, {
                owner: req.user._id,
                approvedBy: req.user._id,
                submittedBy: req.user._id
            }));
            surveyPrototype.save(function (err) {
                if (err) {
                    return next(['MongoSaveError', err]);
                }
                res.PreBayMaxResult = surveyPrototype;
                next();
            });
        },
        createSurveyInstance: function (req, res, next) {
            var survey = new Survey(req.body);
            survey.save(function (err) {
                if (err) {
                    return next(['MongoSaveError', err]);
                }
                res.PreBayMaxResult = survey;
                next();
            });
        },
        createSurvey: function (req, res, next) {
            var surveyBody = _.extend(req.body, {participant: req.user._id});
            $.waterfall([
                function (cb) {
                    if (!surveyBody.prototypeId) {
                        return cb(new Error('Please provide prototype ID.'));
                    }
                    SurveyPrototype
                        .findById(surveyBody.prototypeId)
                        .populate('questions')
                        .exec(function (err, prototype) {
                            if (err) {
                                return cb(err);
                            }
                            if (!prototype[req.user.role + 'Visible']) {
                                return cb(new Error('This survey is not available for ' + req.user.role));
                            }
                            cb(null, prototype);
                        });
                },
                function (prototype, cb) {
                    var counter = 0;
                    $.eachSeries(prototype.questions, function (question, fn) {
                        if (!question.attrName) {
                            return fn();
                        }
                        HealthMetaData.modernQuery({
                            properties: {
                                dataName: {equals: question.attrName}
                            }
                        }, function (err, metaData) {
                            if (err) {
                                return fn(['QueryError', err]);
                            }
                            if (!metaData || metaData.length === 0) {
                                return fn(['QueryError', 'Metadata not found']);
                            }
                            var validation = metaData[0].validateData(surveyBody.answers[counter]);
                            if (validation.invalid) {
                                return fn(['StandardError', validation.message]);
                            }

                            PatientProfile.modernQuery({
                                properties: {
                                    owner: {equals: req.user._id}
                                }
                            }, function (err, profile) {
                                if (err) {
                                    return fn(['QueryError', err]);
                                }
                                if (!profile || profile.length === 0) {
                                    return fn(['QueryError', 'profile not found']);
                                }

                                var index = profile[0].attributeNames.indexOf(question.attrName);
                                if (index !== -1) {
                                    profile[0].attributes[index].data = surveyBody.answers[counter];
                                    profile[0].attributes[index].updatedAt = new Date();
                                } else {
                                    profile[0].attributeNames.push(question.attrName);
                                    profile[0].attributes.push({
                                        meta: metaData[0]._id,
                                        data: surveyBody.answers[counter]
                                    });
                                }

                                profile[0].save(function (err) {
                                    if (err) {
                                        return fn(['MongoSaveError', err]);
                                    }
                                    counter += 1;
                                    fn();
                                });
                            });
                        });
                    }, cb);
                },
                function (cb) {
                    var survey = new Survey(surveyBody);
                    survey.save(function (err) {
                        if (err) {
                            return cb(['MongoSaveError', err]);
                        }
                        res.PreBayMaxResult = survey;
                        cb();
                    });
                }
            ], next);
        },
        listPrototypes: function (req, res, next) {
            SurveyPrototype
                .find({})
                //.populate('question')
                .exec(function (err, questions) {
                    if (err) {
                        return next(err);
                    }
                    if (!questions) {
                        return next(new Error('Questions not found'));
                    }

                    res.PreBayMaxResult = questions;
                    next();
                });
             
        },
        listInstanceByUser: function (req, res, next) {
            getOnesAnswers(req.user._id, function (err, answers) {
                if (err) {
                    return next(err);
                }
                res.PreBayMaxResult = answers;
                next();
            });
        },
        getInstances: function (req, res, next) {
            Survey
                .find({})
                .populate('prototypeId')
                .populate('questions')
                .exec(function (err, survey) {
                    if (err) {
                        return next(err);
                    }
                    if (!survey) {
                        return next(new Error('Survey not found'));
                    }
                    res.PreBayMaxResult = survey;
                    next();
                });
        },
         getInstance: function (req, res, next) {
            Survey
                .findById(req.params.surveyId)
                .populate('prototypeId')
                .populate('questions')
                .exec(function (err, survey) {
                    if (err) {
                        return next(err);
                    }
                    if (!survey) {
                        return next(new Error('Survey not found'));
                    }
                    res.PreBayMaxResult = survey;
                    next();
                });
        },
        getQuestions: function (req, res, next) {
            Question
                .find({})
                //.populate('question')
                .exec(function (err, questions) {
                    if (err) {
                        return next(err);
                    }
                    if (!questions) {
                        return next(new Error('Questions not found'));
                    }

                    res.PreBayMaxResult = questions;
                    next();
                });
        },
        getPrototype: function (req, res, next) {
            SurveyPrototype
                .findById(req.params.prototypeId)
                .populate('questions')
                .exec(function (err, prototype) {
                    if (err) {
                        return next(err);
                    }
                    if (!prototype) {
                        return next(new Error('Survey prototype not found'));
                    }
                    res.PreBayMaxResult = prototype;
                    next();
                });
        }
    };
};