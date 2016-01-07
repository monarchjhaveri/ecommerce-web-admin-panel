
if (process.env.NODE_ENV !== 'production') {
  var dotenv = require('dotenv');
  dotenv.config();
}

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var auth = require('basic-auth');

var routes = require('./routes/index');
var products = require('./routes/products');
var orders = require('./routes/orders');
var returns = require('./routes/returns');
var refunds = require('./routes/refunds');
var jetProducts = require('./routes/jetProducts');
var merchant = require('./routes/merchant');

var JetService = require('./services/JetService/JetService');

// These requires will trigger various timed jobs
var AutoAcknowledgeJob = require('./jobs/AutoAcknowledgeJob');
var InventorySyncJob = require('./jobs/InventorySyncJob');

// initialize express
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(function(req, res, next) {
  var user = auth(req);

  var username = process.env.BASIC_AUTH_USERNAME || 'admin';
  var password = process.env.BASIC_AUTH_PASSWORD || 'password';

  if (user === undefined || user['name'] !== username || user['pass'] !== password) {
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm="MyRealmName"');
    res.end('Unauthorized');
  } else {
    next();
  }
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/products', products);
app.use('/api/orders', orders);
app.use('/api/jet/products', jetProducts);
app.use('/api/merchant', merchant);
app.use('/api/returns', returns);
app.use('/api/refunds', refunds);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(logger);



// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      stack: err.stack
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: {}
  });
});

// Connect JetService
JetService.connect(process.env.TEST_API_USER, process.env.TEST_API_SECRET);

module.exports = app;
