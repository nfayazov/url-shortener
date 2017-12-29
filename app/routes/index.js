const mongo = require('mongodb');
const APP_URL = 'https://nadir-url.herokuapp.com/';
const path = process.cwd();

module.exports = function(app, passport) {

   app.route('/')
      .get(isLoggedIn, function(req, res) {
         res.sendFile(path + '/public/index.html');
      });
   
   app.route('/login')
      .get(function (req, res) {
         res.sendFile(path + '/public/login.html');
      })
   
   app.route('/auth/facebook')
      .get(passport.authenticate('facebook'));
      /*app.get('/new/:url*', postURL)
   app.get('/:url', getURL)
   app.get('/login')*/

   app.get('/auth/facebook/callback',
      passport.authenticate('facebook', { failureRedirect: '/login' }),
      function (req, res) {
         // Successful authentication, redirect home. 
         res.redirect('/');
      });


   function isLoggedIn (req, res, next) {
      if (req.isAuthenticated()) {
         return next();
      } else {
         res.redirect('/auth/facebook');
      }
   }
}