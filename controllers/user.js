/* ensureAuthenticated && isProfileOwner == acccess control functions */
const path = require('path'),
    mongoose = require('mongoose'),
    User = require('../models/user')

exports.ensureAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', 'Debes de iniciar sesión para continuar.');
        res.status(200).redirect('/login');
    }
}

exports.isProfileOwner = (req, res, next) => {

    if(req.user._id == req.params.user_id) {
        return next();
    } else {
        res.render('../views/codes/401');
    }
}

exports.renderProfile = (req, res) => {

    const user_id = req.params.user_id;

    User.findById(user_id, function(err, user) {

        if(err) throw(err);

        if(!user.esential.isComplete) {

            req.flash('error_msg', 'Antes de poder acceder a tu perfil, debes de llenar la información esencial.');
            res.redirect('/user/settings/' + user_id);
        } else {
            res.status(200).render('../views/user/profile', { user });
        }
    });
}

exports.renderProfileSettings = (req, res) => {

    const user_id = req.params.user_id;

    User.findById(user_id, function(err, user) {

        if(err) throw(err);
        res.status(200).render('../views/user/settings', { user });
    });
}


exports.saveProfileSettings = (req, res) => {

    const user_id = req.params.user_id;
    var userInfo = '';

    req.checkBody('name').notEmpty();
    req.checkBody('surnames').notEmpty();
    req.checkBody('email').notEmpty();
    req.checkBody('title').notEmpty();
    req.checkBody('description').notEmpty();
    
    const errors = req.validationErrors();

    if(errors) {
        userInfo = {
            'esential.name': req.body.name,
            'esential.surnames': req.body.surnames,
            'credentials.email': req.body.email,
            'esential.title': req.body.title,
            'esential.description': req.body.description,
            'esential.isComplete': false
        }
    } else {
        userInfo = {
            'esential.name': req.body.name,
            'esential.surnames': req.body.surnames,
            'credentials.email': req.body.email,
            'esential.title': req.body.title,
            'esential.description': req.body.description,
            'esential.isComplete': true
        }
    }

    User.findByIdAndUpdate(user_id, userInfo, function(err, user) {

        if(err) throw(err);
        
        req.flash('success_msg', '¡Tus datos han sido guardados exitosamente!');
        res.status(200).redirect('/user/' + user_id);
    })
}

exports.renderCreatePublication = (req, res) => {

    const user_id = req.params.user_id;

    User.findById(user_id, function(err, user) {
        if(err) throw(err);

        if(!user.financial.isComplete) {

            req.flash('error_msg', 'No podrás publicar un anuncio hasta que completes la información de tu usuario.')
            res.render('../views/user/publish');
        } else {

            res.status(200).render('../views/user/publish');
        }
    });
}