var express = require('express');
var router = express.Router();
var SurveyPrototype = require('../mongo_modules/surveyPrototype');
var SurveyInstance = require('../mongo_modules/surveyInstance');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

/*  */
router.get('/', function(req, res, next) {

	SurveyPrototype.find({},function(error,surveys){
		if(error) console.error(error);
		console.log(surveys);
		res.send(surveys);
	});
    
});



module.exports = router;
