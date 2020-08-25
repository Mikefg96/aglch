const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../models/user');

passport.use(new LocalStrategy({ 
    usernameField: 'email',
    passReqToCallback: true
    },
    function(req, email, password, done) {
        User.findOne({ 'email': email }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: '¡Usuario incorrecto!' });
            }
            User.comparePassword(password, user.password, function(err, isMatch) {
                if(err) { throw(err); }
                if(isMatch) { return done(null, user); } 
                else { 
                    return done(null, false, { message: '¡Contraseña inválida!' }); 
                }
            });
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});