const mongo = require('mongodb');
const APP_URL = 'https://nadir-url.herokuapp.com/';
const path = process.cwd();

module.exports = function(app, passport) {

   function isLoggedIn(req, res, next) {
      if (req.isAuthenticated()) {
         return next();
      } else {
         res.redirect('/login');
      }
   }

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

   app.route('/auth/facebook/callback')
      .get(passport.authenticate('facebook', { failureRedirect: '/login' }),
      function (req, res) {
         // Successful authentication, redirect home.
         res.redirect('/');
      },
      function(err, req, res, next) {
         // You could put your own behavior in here, fx: you could force auth again...
         // res.redirect('/auth/facebook/');
         if(err) {
            res.status(400);
            res.end(err.message );
         }
      }
   );

}