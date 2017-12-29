'use strict';

const FacebookStrategy = require('passport-facebook').Strategy,
      User = require('/../models/users'),
      dotenv = require('dotenv').load();

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
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.APP_URL
   }, 
   function(token, refreshToken, profile, done) {
      process.nextTick(function () {
         User.findOne({'facebook.id': profile.id }, function(err, done) {
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
