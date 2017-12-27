'use strict';

var express = require("express"),
    routes = require('./app/routes/index.js'),
    mongo = require('mongodb').MongoClient;
    
var app = express();

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));

mongo.connect('mongodb://localhost:27017/url-notifier', function(err, db) {
   if (err) throw err
   else {

      routes(app, db)

      var port = process.env.PORT || '3000'

      app.listen(port, function(err) {
         if (err) throw err;
      })
   }

})


