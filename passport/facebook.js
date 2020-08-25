const passport = require('passport'),
    FacebookStrategy = require('passport-facebook'),
    User = require('../models/user');

//TODO: Cuando haya una cuenta local en la DB con el correo de Fb, sincronizar las cuentas para evitar duplicaciones.
passport.use(new FacebookStrategy({
    clientID: '2381388665425690',
    clientSecret: 'e9b295d164d87e56a4f7ad43ff8392cd',
    callbackURL: "http://localhost:8080/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name', 'middle_name', 'gender', 'link']
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({ 'credentials.facebook_id': profile.id }, function(err, user) {
            if(err) return done(err);
            if(!user) {
                const newUser = new User({
                    'credentials.provider': profile.provider,
                    'credentials.email': profile.emails[0].value,
                    'credentials.facebook_id': profile.id,
                    'esential.isComplete': false,
                    'financial.isComplete': false
                });
                newUser.save(function(err){
                    if(err) throw(err);
                    return done(err, newUser);
                });
            } else return done(null, user);
        });
    }
));