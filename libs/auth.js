const config = require('./config');
const passport = require('passport');
const {BasicStrategy} = require('passport-http');
const ClientPasswordStrategy = require('passport-oauth2-client-password');
const BearerStrategy = require('passport-http-bearer');
const UserModel = require('../models/User');
const ClientModel = require('../models/Client');
const AccessTokenModel = require('../models/AccessToken');

passport.use(new BasicStrategy(
    function(username, password, done) {
        ClientModel.findOne({ clientId: username }, function(err, client) {
            if (err) { return done(err); }
            if (!client) { return done(null, false); }
            if (client.clientSecret != password) { return done(null, false); }

            return done(null, client);
        });
    }
));

passport.use(new ClientPasswordStrategy(
    function(clientId, clientSecret, done) {
        ClientModel.findOne({ clientId: clientId }, function(err, client) {
            if (err) { return done(err); }
            if (!client) { return done(null, false); }
            if (client.clientSecret != clientSecret) { return done(null, false); }

            return done(null, client);
        });
    }
));

passport.use(new BearerStrategy(
    function(accessToken, done) {
        AccessTokenModel.findOne({ token: accessToken }, function(err, token) {
            if (err) { return done(err); }
            if (!token) { return done(null, false); }

            if( Math.round((Date.now()-token.created)/1000) > config.get('security:tokenLife') ) {
                AccessTokenModel.remove({ token: accessToken }, function (err) {
                    if (err) return done(err);
                });
                return done(null, false, { message: 'Token expired' });
            }

            UserModel.findById(token.userId, function(err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false, { message: 'Unknown user' }); }

                const info = { scope: '*' }
                done(null, user, info);
            });
        });
    }
));