
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , mongoStore = require('connect-mongo')(express)
  , passport = require('passport')
  , flash = require('connect-flash');

// connect to the databse
mongoose.connect('mongodb://localhost/bootstrap');
var db = mongoose.connection;
db.on('error', function(err) {
  console.error(err);
});
db.once('open', function() {
  console.log('database connected');
});

require('./config/passport');

app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: 'secret',
    cookie: {
      path: '/',
      maxAge: 365 * 24 * 60 * 60 * 1000
    },
    store: new mongoStore({db: db.db})
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  require('./config/helpers');
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// routes
require('./routes');
require('./routes/account');

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

