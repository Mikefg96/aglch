const passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    User = require('../models/user');

passport.use(new GoogleStrategy({
    clientID: '802702180555-44nuvooqv9ivkc91ar25m8iiv1rg3r90.apps.googleusercontent.com',
    clientSecret: 'VnLnWj2_4tDd4spVQ3v3JbPe',
    callbackURL: "http://agrariumtech.com/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({ 'credentials.google_id': profile.id }, function(err, user) {
            if(err) return done(err);
            if(!user) {
                const newUser = new User({
                    'credentials.provider': profile.provider,
                    'credentials.email': profile.emails[0].value,
                    'credentials.google_id': profile.id,
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
