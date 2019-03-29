var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var PORT = process.env.PORT || "3001";
var apiRoutes = require('./routes/api-routes');
var app = express();
var auth = require('./routes/auth');
var sms = require('./utils/sms');
require('dotenv').config()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended': 'false' }));
// console.log('here',process.env.NODE_ENV)
if (process.env.NODE_ENV === 'production') {
  console.log('in the static express build');
  app.use(express.static(path.join(__dirname, '/client/build')));
}

app.use('/api', apiRoutes);
app.use('/api/auth', auth);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Send the error message
  res.status(err.status || 500);
  res.sendStatus(err.status);
});

// taps db every minute to check if scheduled texts need to be sent.
sms.scanTimeToSendTexts(1);

module.exports = app;
