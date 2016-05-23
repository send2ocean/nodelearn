'use strict';
 
/**
 * Definition of Survey and related Models and Schemas
 */
module.exports = function (Mongo,mongoose,Schema) {
     
    function existAttrName(value, cb) {
        cb(true);
    }

    function onlyExistWhenAnswerTypeIs(type) {
        return function (value) {
             
            return true;
        };
    }

    var questionSchema = new Schema({
        question: {
            type: String,
            required: true
        },
        note: {
            type: String,
            required: true
        },
        for: {
            type: String,
            enum: [
                'patient', //this role will map the attrName to HealthMetaData collection
                'doctor'   //TODO this role will map the attrName to DoctorProfile collection
            ],
            required: true
        },
        attrName: {
            type: String,
            validate: [existAttrName, 'attrName doesn\'t exist']
        },
        answerType: {
            type: String,
            enum: [
                'number',
                'boolean',
                'frequency',
                'level',
                'choice',
                'checkList'
            ],
            required: true
        },
        inputControl: {
            type: String,
            enum: [
                'textBox',
                'slider',
                'dateTime'
            ],
            validate: [onlyExistWhenAnswerTypeIs('number'), 'Only number answer type can have a inputControl property']
        },
        options: {
            type: [String]
        },
        default: {
            type: Number,
            validate: [onlyExistWhenAnswerTypeIs('number'), 'Only number answer type can have a default property']
        },
        inputPrecision: {
            type: Number,
            validate: [onlyExistWhenAnswerTypeIs('number'), 'Only number answer type can have a inputPrecision property']
        },
        min: {
            type: Number,
            validate: [onlyExistWhenAnswerTypeIs('number'), 'Only number answer type can have a range property']
        },
        max: {
            type: Number,
            validate: [onlyExistWhenAnswerTypeIs('number'), 'Only number answer type can have a range property']
        },
        createdAt: {
            type: Date,
            default: Date.now,
            required: true
        },
        updatedAt: Date,
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    });

    var surveyPrototypeSchema = new Schema({
        title: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        description: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true
        },
        source: {
            type: String,
            required: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        publicDomain: {
            type: Boolean,
            required: true
        },
        authorizationCode: {
            type: String,
            required: true
        },
        approvedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        submittedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        state: {
            type: String,
            enum: [
                'published',
                'draft',
                'submitted'
            ],
            required: true,
            default: 'draft'
        },
        questions: {
            type: [{type: Schema.Types.ObjectId, ref: 'SurveyQuestion'}],
            required: true
        },
        tags: {
            type: [String]
        },
        createdAt: {
            type: Date,
            default: Date.now,
            required: true
        },
        updatedAt: Date,
        publishedAt: Date,
        dateExpiredAt: Date,
        patientVisible: Boolean,
        doctorVisible: Boolean,
        repVisible: Boolean
    });

    var surveySchema = new Schema({
        prototypeId: {
            type: Schema.Types.ObjectId,
            ref: 'SurveyPrototype',
            required: true
        },
        participant: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false
        },
        beginAt: {
            type: Date,
            required: true
        },
        completedAt: {
            type: Date,
            default: Date.now
        },
        questions: {
            type: [{type: Schema.Types.ObjectId, ref: 'SurveyQuestion'}],
            required: true
        },
        answers: {
            type: [Schema.Types.Mixed],
            required: true
        }
    });

    
    var Question = mongoose.model('SurveyQuestion', questionSchema);
    var SurveyPrototype = mongoose.model('SurveyPrototype', surveyPrototypeSchema);
    var Survey = mongoose.model('Survey', surveySchema);
 

    Mongo.Question = Question;
    Mongo.SurveyPrototype = SurveyPrototype;
    Mongo.Survey = Survey;
    
};
