'use strict';

module.exports = function(Account) {
  Account.creatTeamLeader = function(cb) {
    var currentDate = new Date();
    var currentHour = currentDate.getHours();
    var OPEN_HOUR = 6;
    var CLOSE_HOUR = 20;

    console.log('Current hour is ' + currentHour);
    var User = app.models.account;
    var Role = app.models.Role;
    Role.find([],function(err,models){
        if (err) {}
        console.log('Roles list:', models);
    });
    var response;

    cb(null, response);
  };
  Account.remoteMethod(
    'creatTeamLeader',
    {
      http: {path: '/creatTeamLeader', verb: 'post'},
      returns: {arg: 'status', type: 'string'}
    }
  );

};
