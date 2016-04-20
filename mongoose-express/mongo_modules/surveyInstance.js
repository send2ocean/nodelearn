var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var Schema = mongoose.Schema;

var SurveyInstanceSchema = new Schema({
  SurveyPrototypeID:   ObjectId,
  createAtdate: { type: Date, default: Date.now },
  personID:   ObjectId,
  hidden: {type:Boolean,default:false},
  content: [{
    question: {type:String,required: true},
    answer:{type:String,required: true},
    attrName:  {type:String,required: true},
    note:String,
    answerType:{type:String,enum:["Scalar","Boolean","Frequency","Level","Choice","CheckList"]}, 
    scalarDefault:Number,//scalar only
    range:{max:Number,min:Number},//scalar only
    options:Array,
    inputControl:{type:String,enum:["scroll","slider"]},//scalar only
    inputPrecision:Number //scalar only
  }]
});
var SurveyInstance = mongoose.model('SurveyInstance', SurveyInstanceSchema);

module.exports = SurveyInstance;
