'use strict';

module.exports = {
    MONGOOSE: {
        URI: 'mongodb://localhost:27017/healthlinkDemo',
        OPTIONS: {
            server: {
                poolSize: 5,
                socketOptions: {
                    keepAlive: 1
                }
            },
            replset: {
                socketOptions: {
                    keepAlice: 1
                }
            }
        }
    },

    JWT: {
        SECRET: 'HeAlTHliNk>demo',
        EXPIRES_TIME: 60*5
    }
};