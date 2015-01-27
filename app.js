var express = require('express');
var path = require('path');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('./auth');
var bodyParser = require('body-parser');
var multer = require('multer');
var mysql = require('mysql');
var myConnection = require('express-myconnection');

//  =================
//  = Setup the app =
//  =================

// The app itself
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//  ============================
//  = Middleware configuration =
//  ============================

// Setup serving static assets
app.use(express.static(path.join(__dirname, 'public')));

// Add session support
app.use(session({
  secret: 'briljant', // CHANGE THIS!!!
  store: new FileStore(),
  saveUninitialized: true,
  resave: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Setup bodyparser
app.use(bodyParser.urlencoded({extended: true}));

// Setup Multer
app.use(multer({ dest: './uploads/',
 rename: function (fieldname, filename) {
    return filename+Date.now();
  },
onFileUploadStart: function (file) {
  console.log(file.originalname + ' is starting ...')
},
onFileUploadComplete: function (file) {
  console.log(file.fieldname + ' uploaded to  ' + file.path)
  done=true;
}
}));

// Setup MySQL

// Database configuration
var dbOptions = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sss-final'
};

// Add connection middleware
app.use(myConnection(mysql, dbOptions, 'single'));

//  ===========
//  = Routers =
//  ===========
var baseRouter = require('./routers/baseRouter');

app.use('/', baseRouter);

// This should be the ONLY route in this file!
app.get('/', function(req, res){
  res.redirect('/');
});

//  =================
//  = Start the app =
//  =================

app.listen(3000, function(){
  console.log('App listening at http://localhost:3000');
});