'use strict';
require('dotenv').load();

module.exports = {
   'facebookAuth': {
      'clientID': process.env.FACEBOOK_APP_ID,
      'clientSecret': process.env.FACEBOOK_APP_SECRET,
      'callbackURL': process.env.APP_URL + 'auth/facebook/callback'
   }
};
