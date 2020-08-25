const express = require('express'),
    controller = require('../controllers/public'),
    passport = require('passport'),
    passportFacebook = require('../passport/facebook'),
    passportGoogle = require('../passport/google'),
    passportLocal = require('../passport/local');

const router = express.Router();

router.get('/', controller.renderLanding);

/* ------------------------------
   |     REGISTROS A SUBASTAS    |
   ------------------------------ */
router.get('/registrar/aglch', controller.render_RegisterElPolar);
router.post('/registrar/:subasta', controller.create_User);

// router.post('/create/user', controller.create_User); /* Registro MANUAL del usuario. */

router.get('/login', controller.renderLogin);
router.post('/login/local',
    passport.authenticate('local', { successRedirect: '/event/aglch',
                                     failureRedirect: '/login',
                                     badRequestMessage: 'Todos los campos son obligatorios',
                                     failureFlash: true }));
                                    
router.get('/auth/facebook', passport.authenticate('facebook' , { scope: ['email', 'public_profile'] }));
router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/',
                                        failureRedirect: '/login'
}));

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', 
    passport.authenticate('google', { successRedirect: '/',
                                      failureRedirect: '/login'
}));

router.get('/logout', controller.logoutUser);

router.get('/confirmar/:token', controller.verifyUser);

router.get('/forgot', controller.render_ForgotPassword);
router.post('/forgot-password', controller.forgot_Password);

router.get('/recover/:token', controller.render_recoverPassword);
router.post('/recover-password/:token', controller.recover_pasword);

router.get('/contact-us', controller.render_ContactUs);
router.post('/contact-team',controller.send_contact_mail);
router.get('/about-us', controller.render_AboutUs);
router.get('/terms-conditions', controller.render_Terms);


module.exports = router;