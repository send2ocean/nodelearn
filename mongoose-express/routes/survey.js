var express = require('express');
var router = express.Router();
var SurveyPrototype = require('../mongo_modules/surveyPrototype');
var SurveyInstance = require('../mongo_modules/surveyInstance');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

// invoked for any requests passed to this router
router.use(function(req, res, next) {
   console.log('From Ip address %s ,url is %s',req.ip,req.originalUrl);
  next();
});

/*  SurveyPrototype  Router*/
router.route('/')
  .get(function(req, res) {
    SurveyPrototype.find({},function(error,surveys){
		if(error) console.error(error);
			console.log(surveys);
			res.send(surveys);
		});
  })
  .post(function(req, res) {
  	var survey = new SurveyPrototype();
  	var error = survey.validateSync();
		if(error){
			console.error(error);
			res.send(error);
		}else{
			survey.save();
			res.send("---save Survey Prototype successed----");
		}
     
  })
  .put(function(req, res) {
    res.send('Update the Survey Prototype successed');
  });
  /*  SurveyInstance */
router.route('/instance')
  .get(function(req, res) {
    SurveyInstance.find({},function(error,instances){
		if(error) console.error(error);
			console.log(instances);
			res.send(instances);
		});
  })
  .post(function(req, res) {
  	var instance = new SurveyInstance();
  	var error = instance.validateSync();
		if(error){
			console.error(error);
			res.send(error);
		}else{
			instance.save();
			res.send("---save Survey Instance successed----");
		}
     
  })
  .put(function(req, res) {
    res.send('Update the Survey Instance successed');
  });



module.exports = router;
