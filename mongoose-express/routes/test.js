var express = require('express');
var router = express.Router();
var SurveyPrototype = require('../mongo_modules/surveyPrototype');
var SurveyInstance = require('../mongo_modules/surveyInstance');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

/* Test mongoose  */
router.get('/', function(req, res, next) {
	 
	//list
	SurveyPrototype.find({},function(error,surveys){
		if(error) console.error(error);
		console.log(surveys);
		res.send(surveys);
	});
    
});
router.get('/add', function(req, res, next) {
	var authorID = new mongoose.Types.ObjectId;
	 var survey = new SurveyPrototype( {
		  title:  "survey demo one",
		  description:"this is a demo for survey", 
		  instruction:"some verbose text displayed at the beginning...",
		  //version: ,
		  authorID:   authorID,
		 // createAtdate: { type: Date, default: Date.now },
		  //updateAtdate: { type: Date, default: Date.now },
		  //hidden: {type:Boolean,default:false},
		  content: [
		  {
		    question: "question one",
		    attrName:  "attrName one",
		    note:"note one",
		    answerType:"Choice", 
		    //scalarDefault:Number,//scalar only
		    //range:{max:Number,min:Number},//scalar only
		    options:["Array1","Array2","Array3"]
		    
		  },
		  {
		    question: "question two",
		    attrName:  "attrName two",
		    note:"note two",
		    answerType:"Choice", 
		    //scalarDefault:Number,//scalar only
		    //range:{max:Number,min:Number},//scalar only
		    options:["Array1","Array2","Array3"]
		    
		  }
		  ]

	 });
 	var error = survey.validateSync();
	if(error){
		console.error(error);
		res.send(error);
	}else{
		survey.save();
		res.send("---save successed----");
	}
     
});

module.exports = router;
