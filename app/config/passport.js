'use strict';

const FacebookStrategy = require('passport-facebook').Strategy,
      User = require('../models/users'),
      dotenv = require('dotenv').load(),
      configAuth = require('./auth.js');

module.exports = function(passport) {
   passport.serializeUser(function (user, done) {
      done(null, user.id);
   });

   passport.deserializeUser(function (id, done) {
      User.findById(id, function(err, user) {
         done(err, user);
      });
   });

   passport.use(new FacebookStrategy({
      clientID: configAuth.facebookAuth.clientID,
      clientSecret: configAuth.facebookAuth.clientSecret,
      callbackURL: configAuth.facebookAuth.callbackURL
   }, 
   function(token, refreshToken, profile, done) {
      process.nextTick(function () {
         User.findOne({'facebook.id': profile.id }, function(err, user) {
            if (err) return done(err);
            if (user) return done(null, user)
            else {
               var newUser = new User();

               newUser.facebook.id = profile.id;
               newUser.facebook.username = profile.username;
               newUser.facebook.displayName = profile.diplayName;
               newUser.urls = [];

               newUser.save(function(err) {
                  if (err) {
                     throw err;
                  }

                  return done(null, newUser);
               });
            }
         })
      });
   }));
};
