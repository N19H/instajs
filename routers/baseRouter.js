var express = require('express');
var router = express.Router();
var passport = require('./auth');

router.get('/', function(req, res, next){

  req.getConnection(function(err, connection){
    if(err){ return next(err); }

    connection.query('SELECT * FROM photos', function(err, photos){
      if(err){ return next(err); }
      res.render('test/index', {photos: photos, req:req});
    });
  });

});

router.get('/upload', function(req, res) {
	res.render('test/upload', {req:req});
});

router.post('/', function(req,res) {
  res.redirect('/');
});

router.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs');
});


router.get('/login', function(req, res) {
  res.render('login', {title: 'Log in'});
});

router.post('/login',
  passport.authenticate('local', { successRedirect: '/profile',
                                   failureRedirect: '/login' 
}));

router.get('/logout', function(req, res) {

  // req.session.destroy();
  req.logout();

  res.redirect('/');
});

router.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });

router.get('/user', function(req, res) {
  if (req.session.passport.user === undefined) {
  res.redirect('/login');
  } else {
  res.render('user', {title: 'Welcome!', user: req.user});
  }
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}


module.exports = router;