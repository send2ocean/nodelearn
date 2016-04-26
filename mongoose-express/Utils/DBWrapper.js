'use strict';

var mongoose = require('mongoose'),
    schema   = mongoose.Schema;

module.exports = function (_, $, config, modelDefinitions) {

    function modernQueryBuilder() {
        var model = null;
        return function (queryObj, fn) {
            if (!fn) {
                model = queryObj;
                return;
            }
            var propertiesRule = queryObj.properties,
                fields         = queryObj.fields,
                limit          = queryObj.limit,
                sort           = queryObj.sort ? queryObj.sort : null,
                queryCommand   = model.find();

            _.forOwn(propertiesRule, function (value, key) {
                if (!_.isPlainObject(value)) {
                    throw new Error('The query for a property must be a object');
                }
                _.forOwn(value, function (queryValue, rule) {
                    if (queryValue === null || queryValue === undefined) {
                        return;
                    }
                    return queryCommand.where(key)[rule](queryValue);
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
            queryCommand.exec(function (err, result) {
                if (err) {
                    return fn(['ModernQuery', err]);
                }
                fn(null, result);
            });
        };
    }

    var mango = {};

    if (!config.MONGOOSE) {
        throw new Error('Mongoose setting missing');
    }
    if (!config.MONGOOSE.URI) {
        throw new Error('Mongoose uri missing');
    }
    if (!config.MONGOOSE.OPTIONS) {
        throw new Error('Mongoose options missing');
    }

    if (!modelDefinitions || !_.isArray(modelDefinitions)) {
        throw new Error('model definitions must be defined and is an array');
    }

    mongoose.connect(config.MONGOOSE.URI, config.MONGOOSE.OPTIONS);

    _.forEach(modelDefinitions, function (modelDefinition) {
        modelDefinition.model.call(null, mango, mongoose, schema, _, $, modernQueryBuilder);
    });

    return mango;
};
