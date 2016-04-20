var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

 
var Schema = mongoose.Schema;

var SurveyPrototypeSchema = new Schema({
  title:  {type:String,required: true},
  description:String,//more info than title
  instruction:String,//some verbose text displayed at the beginning...
  version: { type: Number, default: 1.0},
  authorID:   ObjectId,
  createAtdate: { type: Date, default: Date.now },
  updateAtdate: { type: Date, default: Date.now },
  hidden: {type:Boolean,default:false},
  content: [{
    question: {type:String,required: true},
    attrName:  {type:String,required: true},
    note:String,
    answerType:{type:String,enum:['Scalar','Boolean','Frequency','Level','Choice','CheckList']}, 
    scalarDefault:Number,//scalar only
    range:{max:Number,min:Number},//scalar only
    options:Array,
    inputControl:{type:String,enum:["scroll","slider"]},//scalar only
    inputPrecision:Number //scalar only
  }]
});
var SurveyPrototype = mongoose.model('SurveyPrototype', SurveyPrototypeSchema);
 
module.exports = SurveyPrototype;
