var mongo = require("mongodb").MongoClient
var express = require("express")
var path = require("path")
var app = express()

var APP_URL = 'https://nadir-url.herokuapp.com/'

mongo.connect(process.env.MLAB_URL, function(err, db) {
   if (err) throw err
   else {

      routes(db)

      var port = process.env.PORT || '3000'

      app.listen(port, function(err) {
         if (err) throw err;
      })
   }

})

function routes(db) {

   app.get('/', indexURL)
   app.get('/new/:url*', postURL)
   app.get('/:url', getURL)

   function indexURL(req, res) {

      var file = path.join(__dirname, 'index.html')
      res.sendFile(file, function(err) {
         if (err) return console.error(err)
         console.log('Sent: ' + file)
      })
   }

   function getURL(req, res) {

      var url = req.params.url
      var c = db.collection('urls')
      c.findOne({
         short_url : parseInt(url)
      }, function(err, result) {
         if (err) return console.error(err)
         else if (!result) {
            res.send({
               "error": "This url is not in the database."
            })
         }
         else res.redirect(result.url)
      })

   }

   function postURL(req, res) {

      var redirect_url = req.url.slice(5)

      if (validateURL(redirect_url)) {
         //generate a random four digit number
         var entry = {
            url : redirect_url,
            short_url: Math.floor(Math.random() * 10000)
         };

         var c = db.collection('urls')
         c.insert(entry, function(err, data) {
            if (err) throw err
            else res.send({
               "original_url": redirect_url,
               "short_url": APP_URL + entry.short_url
            })
         })
      }
      else {
         res.send({
            "error" : "Wrong URL format"
         })
      }

   }

   function validateURL(url) {
    // Checks to see if it is an actual url
    // Regex from https://gist.github.com/dperini/729294
    var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    return regex.test(url);
  }

}
