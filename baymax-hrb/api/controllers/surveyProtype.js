'use strict';

var mongo = require('../../utils/DBWrapper.js');
 

module.exports = {
    listSurveyProtypes: listSurveyProtypes
};

function listSurveyProtypes(req, res) {
     console.log(mongo.Schemas)
    mongo.Schemas.Question.find({}, function(err, surveyPtotypes) {

        if (err) {
            res.json(err);
        }
        res.json(surveyPtotypes);
    });


}
function hello(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var name = req.swagger.params.name.value || 'stranger';
  var hello = util.format('Hello, %s!', name);

  // this sends back a JSON response which is a single string
  res.json(hello);
}

 
