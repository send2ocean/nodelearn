'use strict';

var controllerDef = require('../controller');

module.exports = function (router, Auth, Mango, _, $) {

    var controller = controllerDef(_, $, Auth, Mango);

    router.route('/admin')
        .post(controller.create('admin'));

    router.route('/patients')
        .post(controller.create('patient'))
        .patch([
            Auth.needA('patient'),
            controller.update('patient')
        ])
        .delete([
            Auth.needA('patient'),
            controller.remove
        ]);

    router.route('/reps')
        .post(controller.create('rep'))
        .patch([
            Auth.needA('rep'),
            controller.update('rep')
        ])
        .delete([
            Auth.needA('rep'),
            controller.remove
        ]);

    router.route('/doctors')
        .post(controller.create('doctor'))
        .patch([
            Auth.needA('doctor'),
            controller.update('doctor')
        ])
        .delete([
            Auth.needA('doctor'),
            controller.remove
        ]);

    router.route('/authenticate')
        .post([
            Auth.needA(),
            controller.auth
        ]);

    router.route('/login')
        .post(controller.login);

    router.route('/logout')
        .post(function (req, res) {
            //remove token cache
            res.status(200).json({});
        });

    router.route('/doctors/:doctorIdInEight/followers')
        .post([
            Auth.needA('patient'),
            controller.followDoc
        ]);

    router.route('/doctors/:doctorIdInEight/repConnectors')
        .post([
            Auth.needA('rep'),
            controller.serveDoc
        ]);

    router.route('/reps/:repId/connectedDoctors')
        .get([
            Auth.needA('rep'),
            controller.listRepConnectors
        ]);

    return router;
};
