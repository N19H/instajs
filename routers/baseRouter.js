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

router.post('/signup', function (req, res){
 var username = req.body.username;
 var password = req.body.password;
 var firstname = req.body.firstname;
 var surname = req.body.surname;
 var email = req.body.email;

  req.getConnection(function(err, connection){
    if(err){ return next(err); }

    connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows) {
                if (err) {
                    console.log('oeps');
                    res.redirect('/signup');
                }
                if (rows.length) {
                    res.redirect('/signup');
                } else {
                    // if there is no user with that username
                    // create the user
                    var newUserMysql = {
                        username: username,
                        password: password,
                        email: email,
                        firstname: firstname,
                        surname: surname
                    // use the generateHash function in our user model
                    };
                    console.log(newUserMysql);

                    var insertQuery = "INSERT INTO users (username, password, firstname, surname, email) values (?,?,?,?,?)";

                    connection.query(insertQuery,[newUserMysql.username, newUserMysql.password, newUserMysql.firstname, newUserMysql.surname, newUserMysql.email],function(err, rows) {
                        newUserMysql.id = rows.insertId;

                        res.redirect('/profile');
                    });
                }
            });
  });

   

 req.session.username = username;

 console.log(username);

});

router.get('/login', function(req, res) {
  res.render('login', {title: 'Log in'});
});

router.post('/login', function(req, res) {
  passport.authenticate('local-login', {req: req, successRedirect: '/profile',
                                   failureRedirect: '/login'

  });
});

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