'use strict';

module.exports = function (Mango, mongoose, Schema, _, $, queryBuilder) {

    var healthMetaDataSchema = new Schema({
        dataName: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        validateFunc: {
            type: String
        },
        //data expired in days
        dataExpiredIn: {
            type: Number
        }
    });

    healthMetaDataSchema.methods = {
        validateData: function (data) {
            var isValid = eval('(function(x){' + this.validateFunc + '})'),
                result = {
                    invalid: false,
                    message: null
                };
            if (!isValid(data)) {
                result.success = true;
                result.message = 'Invalid answer of ' + this.dataName;
            }
            return result;
        }
    };

    var patientDataSchema = new Schema({
        //describe the data entry type
        sourceType: {
            type: String,
            required: true,
            enum: [
                'entry',
                'ios-health-app',
                'survey',
                'system-test'
            ]
        },
        metaData: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'HealthMetaData'
        },
        owner: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        createdAt: { //by patient
            type: Date,
            required: true,
            default: Date.now
        },
        postedAt: { //by server
            type: Date,
            required: true,
            default: Date.now
        },
        data: {
            type: Schema.Types.Mixed,
            required: true
        }
    });

    var patientProfileSchema = new Schema({
        owner: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        attributeNames: {
            type: [String],
            default: []
        },
        attributes: {
            type: [{
                meta: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    ref: 'HealthMetaData'
                },
                data: {
                    type: Schema.Types.Mixed, //defined in metaData collection
                    required: true
                },
                createdAt: {
                    type: Date,
                    required: true,
                    default: Date.now
                },
                updatedAt: Date
            }],
            default: []
        }
    });

    healthMetaDataSchema.statics.modernQuery = queryBuilder();
    patientDataSchema.statics.modernQuery = queryBuilder();
    patientProfileSchema.statics.modernQuery = queryBuilder();

    var HealthMetaData = mongoose.model('HealthMetaData', healthMetaDataSchema),
        PatientData    = mongoose.model('PatientData', patientDataSchema),
        PatientProfile = mongoose.model('PatientProfile', patientProfileSchema);

    HealthMetaData.modernQuery(HealthMetaData);
    PatientData.modernQuery(PatientData);
    PatientProfile.modernQuery(PatientProfile);

    Mango.HealthMetaData = HealthMetaData;
    Mango.PatientData = PatientData;
    Mango.PatientProfile = PatientProfile;
};