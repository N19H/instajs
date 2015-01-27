var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mysql = require('mysql');

var connection = mysql.createConnection({
 host : 'localhost',
 user : 'root',
 password : '',
 database : 'sss-final'
});

passport.use('local-login', new LocalStrategy(
    function(username, password, done) {
        if (username) {
            console.log(username);
            var pass = password;
            console.log(pass);
            connection.query('SELECT * FROM users WHERE username = ?', username, function(err, rows) {
                if(err)
                    return err; 
                if(rows[0]) {
                    console.log(rows);
                    if (pass === rows[0].password) {
                        console.log("succes");
                        return done(null, {username: rows[0].username});
                    } else { 
                        console.log("faal");
                        return done(null, false); 
                    }
                } else { 
                        console.log("faal");
                        return done(null, false); 
                    }
             });
        }
    }
));

passport.use(
        'local-signup',
        new LocalStrategy(
        function(username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            console.log(username);
            connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows) {
                if (err) {
                    console.log('oeps');
                    return done(err);
                }
                if (rows.length) {
                    return done(null, false);
                } else {
                    // if there is no user with that username
                    // create the user
                    var newUserMysql = {
                        username: username,
                        password: password,
                        email: 'poep'
                    // use the generateHash function in our user model
                    };
                    console.log(newUserMysql);

                    var insertQuery = "INSERT INTO users (username, password, email) values (?,?,?)";

                    connection.query(insertQuery,[newUserMysql.username, newUserMysql.password, newUserMysql.email],function(err, rows) {
                        newUserMysql.id = rows.insertId;

                        return done(null, newUserMysql);
                    });
                }
            });
        })
    );

passport.serializeUser(function(user, done) {
    done(null, user.username);
});

passport.deserializeUser(function(username, done) {
    done(null, {username: username});
});

module.exports = passport;

 