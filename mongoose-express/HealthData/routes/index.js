'use strict';

var controllerDef = require('../controller');

module.exports = function (router, Auth, Mango, _, $) {

    var controller = controllerDef(_, $, Mango);

    router.route('/health_data_meta')
        .post([
            Auth.needA('admin'),
            controller.createMetaData
        ]);

    router.route('/daily-records')
        .get([
            Auth.needA(['patient']),
            controller.listRecords
        ])
        .post([
            Auth.needA(['patient']),
            controller.newRecord
        ]);

    router.route('/health-data/:dataName')
        .get([
            Auth.needA(['patient']),
            controller.myHealthData,
            controller.getSpecifyData
        ])
        .post([
            Auth.needA('patient'),
            controller.myHealthData,
            controller.updateSpecifyData
        ]);

    /**
     * deal with bodyFat, height, width, and bmi
     */
    router.route('/health-profile/bmi')
        .get([
            Auth.needA(['patient']),
            controller.myHealthData,
            controller.getBodyInfo
        ])
        .post([
            Auth.needA(['patient']),
            controller.myHealthData,
            controller.updateBodyInfo
        ]);

    return router;
};