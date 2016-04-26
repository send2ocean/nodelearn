'use strict';

var controllerDef = require('../controller');

module.exports = function (router, Auth, Mango, _, $) {

    var controller = controllerDef(_, $, Mango);

    router.route('/survey/questions')
        .post([
            Auth.needA('admin'),
            controller.createQuestion
        ])
        .get([
            //Auth.needA(['doctor', 'patient', 'rep']),
            controller.getQuestions
        ]);

    router.route('/survey/prototypes')
        .post([
            Auth.needA('admin'),
            controller.createSurveyPrototype
        ])
        .get([
            Auth.needA(['patient', 'doctor']),
            controller.listPrototypes
        ]);

    router.route('/survey/prototypes/:prototypeId')
        .get([
            Auth.needA(['doctor', 'patient', 'rep']),
            controller.getPrototype
        ]);

    router.route('/surveys')
        .post([
            Auth.needA(['doctor', 'patient', 'rep']),
            controller.createSurvey
        ])
        .get([
            Auth.needA(['patient', 'doctor']),
            controller.listInstanceByUser
        ]);

    router.route('/surveys/:surveyId')
        .get([
            Auth.needA(['doctor', 'patient', 'rep']),
            controller.getInstance
        ]);

     
        

    return router;
};