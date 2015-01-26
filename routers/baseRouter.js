var express = require('express');
var router = express.Router();
var passport = require('./auth');

router.get('/', function(req, res, next){

  req.getConnection(function(err, connection){
    if(err){ return next(err); }

    connection.query('SELECT * FROM users', function(err, users){
      if(err){ return next(err); }
      res.render('test/index', {users: users, req:req});
    });
  });

});

router.get('/upload', function(req, res) {
	res.render('test/upload', {req:req});
});

router.post('/',function(req,res){
  res.redirect('/');
});

router.get('/login', function(req, res) {
  res.render('login', {title: 'Log in'});
});

router.post('/login/', passport.authenticate('local', {
  failureRedirect: '/login', 
  succesRedirect: '/user',
}));

router.get('/user', function(req, res) {
  if (req.session.passport.user === undefined) {
  res.redirect('/login');
  } else {
  res.render('user', {title: 'Welcome!', user: req.user});
  }
});



module.exports = router;