// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: loopback-example-access-control
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

module.exports = function(app) {
  var User = app.models.account;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;

  // RoleMapping.destroyAll()
  // Role.destroyAll()
  // User.destroyAll()
  User.create([
    {username: 'test', email: 'john@doe.com', password: 'test'},
    {username: 'test1', email: 'jane@doe.com', password: 'test'},
    {username: 'admin', email: 'bob@projects.com', password: 'admin'}
  ], function(err, users) {
    if (err) throw err;
    console.log('Created users:', users);

    //create the admin role
    Role.create({
      name: 'admin'
    }, function(err, role) {
      if (err) throw err;
      console.log('Created role:', role);
      //make user to an admin
      role.principals.create({
        principalType: RoleMapping.USER,
        principalId: users[2].id
      }, function(err, principal) {
        if (err) throw err;
        console.log('Created principal:', principal);
      });
    });
    Role.create({
      name: 'teamLeader'
    }, function(err, role) {
      if (err) throw err;
      console.log('Created role:', role);
      //make user to an admin
      role.principals.create({
        principalType: RoleMapping.USER,
        principalId: users[2].id
      }, function(err, principal) {
        if (err) throw err;
        console.log('Created principal:', principal);
      });
    });
  });
};
