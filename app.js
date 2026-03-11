var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var app = express();


// CONNECT MONGODB
mongoose.connect('mongodb://localhost:27017/NNPTUD-S4')
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
    });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// routes
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/roles', require('./routes/roles'));
app.use('/api/v1/products', require('./routes/products'));
app.use('/api/v1/categories', require('./routes/categories'));


// catch 404
app.use(function (req, res, next) {
    next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {

    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');

});

module.exports = app;