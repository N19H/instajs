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

router.post('/upload', function(req, res){
    var username = req.session.username,
        caption = req.body.caption,
        userId,
        upload = req.files,
        naam = upload.userPhoto.originalname + Date.now();

        console.log(upload);
        console.log(upload.userPhoto.name);
        console.log(upload.userPhoto.originalname);
        console.log(caption);



    req.getConnection(function(err, connection){
        if(err){ next(err); }

        connection.query('SELECT id FROM users WHERE username = \'' + username + '\'', function(err, correct){

            if(err){ next(err); }

            if(correct != '' && upload.userPhoto.name && caption != null) {

                userId = correct[0].id

                connection.query('INSERT INTO photos (user_id, caption, filename) VALUES (\'' + userId + '\',\'' + caption + '\',\'' + upload.userPhoto.name + '\')', function(err, user) {
                    if(err){
                        console.error(err);
                        return next(err);
                    }

                    res.redirect('/profile');
                });
            } else {
                res.render('/profile', {
                    error: "Er ging wat fout met het uploaden, geeeeeeen idee wat.", req:req
                });
            }
        });
    });
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

// router.post('/comment', function (req, res){
//  var comment = req.body.comment;
//  var photoId = req.body.photoId;
 
//   req.getConnection(function(err, connection){
//     if(err){ return next(err); }


//                     var insertQuery = "INSERT INTO comments (comment, photoId) values (?,?)";

//                     connection.query(insertQuery,[comment, photoId],function(err, rows) {
                        
//                         res.redirect('/profile');
//                     });
             
//             });
//   });

router.get('/login', function(req, res) {
  res.render('login', {title: 'Log in'});
});

router.post('/login', function(req, res){
   var username = req.body.username;
   var password = req.body.password;
   var userid;
   

   req.getConnection(function(err, connection){
      if(err){ next(err); }
       
        var queryString = 'SELECT id FROM users WHERE username =  \'' + username + '\'';
 
    connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
 
    for (var i in rows) {
        console.log('userid: ', rows[i].id);
        userid = rows[i].id;
    }
  });
      connection.query('SELECT * FROM users WHERE username = \'' + username + '\' AND password = \'' + password + '\'', function(err, match){
          if(err){ next(err); }
          
          if(match != ''){
              req.session.username = username;
              req.session.userId = userid; 
              res.redirect('/profile');
          } else {
              var data = {
                  req: req,
                  error: 'Gebruikersnaam en/of wachtwoord is fout.'
              }
              res.redirect('/login');
      
        }
      })
   }); 
});

router.get('/logout', function(req, res) {

  req.session.destroy();
  // req.logout();

  res.redirect('/');
});

router.get('/profile', function(req, res) {
        if (req.session.username) {
        req.getConnection(function(err, connection){
    if(err){ return next(err); }

    connection.query('SELECT * FROM photos', function(err, photos){
      if(err){ return next(err); }
      res.render('profile', {photos: photos, req:req});
    });
  });
      } else { res.redirect('/login');}
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