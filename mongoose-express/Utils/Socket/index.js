'use strict';

var http = require('http');
var socketIO = require('socket.io');

module.exports = function (_) {
    var server,
        io,
        globalEvents       = {
            userComeIn: 'user come in',
            userLeft: 'user left'
        },
        apiMembers         = [],
        onlineUsersManager = {
            //TODO: must store them in db(redis maybe) in the future, memory for now
            onlineUsers: {
                doctor: [],
                rep: [],
                patient: []
            },
            comeInOne: function (user) {
                console.log(user.role + '-' + user.fullName + '-' + user._id + ' come in our system.');
                this.onlineUsers[user.role].push(user._id);
            },
            leftOne: function (user) {
                _.remove(this.onlineUsers[user.role], function (u) {
                    if (u === user._id) {
                        console.log(user.role + '-' + user.fullName + '-' + u + ' left our system.');
                        return true;
                    }
                    return false;
                });
            },
            isPresented: function (role, userId) {
                return this.onlineUsers[role].indexOf(userId) !== -1;
            }
        };

    function connectionHandler(socket) {

        /**
         * @param role patient, rep, doctor
         * @param targets [String]
         * @param eventName String
         * @param data Object
         */
        function speaker(role, targets, eventName, data) {
            _.forEach(targets, function (userId) {
                if (onlineUsersManager.isPresented(role, userId)) {
                    console.log(role, userId, data);
                    socket.broadcast.emit(eventName + userId, data);
                }
            });
        }

        socket.on('disconnect', function () {
            if (socket.user) { // this indicate that the user is a logged in user
                onlineUsersManager.leftOne(socket.user);
            }
        });

        // when the client emits 'user come in', this listens and executes
        socket.on(globalEvents.userComeIn, function (userObj) {
            // store the userObj in the socket session for this client
            socket.user = userObj;
            onlineUsersManager.comeInOne(userObj);
        });

        _.forEach(apiMembers, function (member) {
            member(speaker);
        });
    }

    return {
        listen: function (port, callback) {
            server.listen(port, callback);
        },
        appendTo: function (expressApp) {
            server = http.Server(expressApp);
            io = socketIO(server);
            io.on('connection', connectionHandler);
        },
        add: function (member) {
            apiMembers.push(member);
        }
    };
};