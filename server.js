'use strict';

var express = require("express"),
    routes = require('./app/routes/index.js'),
    passport = require('passport'),
    session = require('express-session'),
    mongoose = require('mongoose');
    
require('dotenv').load();
require('./app/config/passport')(passport);

var app = express();

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));

mongoose.connect('mongodb://localhost:27017/url-notifier');

app.use(session({
    secret: 'absolutelySecureSecret',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

var port = process.env.PORT || '8000';

app.listen(port, function(err) {
    if (err) throw err;
});

