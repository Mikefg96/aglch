const User = require('../models/user');
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const mail = require("../views/mails/mails.js");
const generatePassword = require('password-generator');

const mailTransporter = nodemailer.createTransport({
    host: "smtp.ionos.es",
    port: 587,
    secure: false,
    tls: {
        ciphers:'SSLv3'
     },
     auth: {
         user: process.env.NOREPLY_MAIL,
         pass: process.env.NOREPLY_PASS
     }
  });

  /* ------------------------------
   |           RENDERS            |
   ------------------------------ */
exports.renderLanding = (req, res) => {
    res.status(200).render('../views/public/landing');
}
exports.render_AboutUs = (req, res) => {
    res.status(200).render('../views/public/about');
}
exports.render_ContactUs = (req, res) => {
    res.status(200).render('../views/public/contact');
}
exports.render_Terms = (req, res) => {
    res.status(200).render('../views/public/terms');
}
exports.render_RegisterElPolar = (req, res) => {
    res.status(200).render('../views/public/reg-subasta', { nombre: 'El Polar', fecha: '11/05/19' });
}
exports.renderLogin = (req, res) => {
    res.status(200).render('../views/public/login');
}
exports.render_ForgotPassword = (req, res) =>{
    res.status(200).render('../views/public/forgot.pug');
}
exports.render_recoverPassword = (req, res) => {
    res.status(200).render('../views/public/recover', { params: { token: req.params.token }});
}

  /* ------------------------------
   |         FUNCIONALIDAD        |
   ------------------------------ */
exports.create_User = (req, res) => {

    // req.checkBody('name').notEmpty().withMessage('Todos los campos son obligatorios');
    // req.checkBody('surname').notEmpty().withMessage('Todos los campos son obligatorios');
    // req.checkBody('rfc').notEmpty().withMessage('Todos los campos son obligatorios');
    // req.checkBody('rfc').isLength({ min: 10 }).withMessage('Faltaron carácteres en tu RFC');
    // req.checkBody('phone').notEmpty().withMessage('Todos los campos son obligatorios');
    // req.checkBody('phone').isLength({ min: 10 }).withMessage('Tienes que incluir tu lada en el teléfono');
    // req.checkBody('address').notEmpty().withMessage('Todos los campos son obligatorios');
    // req.checkBody('neighborhood').notEmpty().withMessage('Todos los campos son obligatorios');
    // req.checkBody('city').notEmpty().withMessage('Todos los campos son obligatorios');
    // req.checkBody('state').notEmpty().withMessage('Todos los campos son obligatorios');
    // req.checkBody('pc').notEmpty().withMessage('Todos los campos son obligatorios');
    // req.checkBody('email').notEmpty().withMessage('Todos los campos son obligatorios');
    // req.checkBody('email').isEmail().withMessage('Dirección de correo inválida');
    // req.checkBody('ine').notEmpty().withMessage('Todos los campos son obligatorios');
    // req.checkBody('ine').isLength({ min: 13 }).withMessage('No. IFE/INE incorrecto');

    // const errors = req.validationErrors();

    // if(errors)
    //     res.render('../views/public/reg-subasta', { errors: errors[0].msg });

    User.findOne({ 'email': req.body.email }, function(err, user) {
        if(err) throw(err);
        if(user) {
            req.flash('error_msg', 'Se ha encontrado una cuenta asociada a este correo; por favor, inicia sesión.');
            res.redirect('/login');
        } else {
            User.find({ 'auctionFolio': /^C/ }, function(err, asociacionUsers) {
                if(err) throw(err);
                if(!asociacionUsers) {
                    var pwd = generatePassword(12, false);
                    
                    const user = new User({
                        'name': req.body.name,
                        'surname': req.body.surname,
                        'provider': 'local',
                        'email': req.body.email,
                        'password': pwd,
                        'additional.RFC': req.body.rfc,
                        'additional.phone': req.body.phone,
                        'additional.address': req.body.address,
                        'additional.neighborhood': req.body.neighborhood,
                        'additional.city': req.body.city,
                        'additional.state': req.body.state,
                        'additional.pc': req.body.pc,
                        'additional.INE': req.body.ine,
                        'auctionFolio': 'B0001',
                        'isVerified': false,
                        'isAdmin': false
                    });
                    User.createUser(user, function(err, callback) {
                        if(err) throw(err);
                    });

                    const data = {
                        'user': req.body.email,
                        'pass': pwd
                    }

                    const mailElpolar = {
                        from: '"Asociación Ganadera Local de Chihuahua 🐮" <noreply@aglch.org>', 
                        to: req.body.email,
                        subject: "¡Tu nuevo usuario y contraseña te esperan!",
                        html: mail.elpolarMail(data)
                    };
                    mailTransporter.sendMail(mailElpolar);

                    req.flash('success_msg', '¡Te has registrado exitosamente!');
                    res.redirect('/login');
                } else {
                    var asociacionUserFolios = [],
                        lastFolio = 0;

                    for(var i = 0; i < asociacionUsers.length; i++) {
                        asociacionUserFolios.push(parseInt(asociacionUsers[i].auctionFolio.slice(1)));
                    }

                    for(var j = 0; j < asociacionUserFolios.length; j++) {
                        if(asociacionUserFolios[j] >= lastFolio) 
                            lastFolio = asociacionUserFolios[j];
                    }

                    var newUserFolio = '';
                    switch(lastFolio.toString().length) {
                        case 1:
                            newUserFolio = 'C000' + (lastFolio + 1);
                            break;
                        case 2: 
                            newUserFolio = 'C00' + (lastFolio + 1);
                            break;
                        case 3:
                            newUserFolio = 'C0' + (lastFolio + 1);
                            break;
                        case 4:
                            newUserFolio = 'C' + (lastFolio + 1);
                            break;
                    }
                    
                    var pwd = generatePassword(12, false);

                    const user = new User({
                        'name': req.body.name,
                        'surname': req.body.surname,
                        'provider': 'local',
                        'email': req.body.email,
                        'password': pwd,
                        'additional.RFC': req.body.rfc,
                        'additional.phone': req.body.phone,
                        'additional.address': req.body.address,
                        'additional.neighborhood': req.body.neighborhood,
                        'additional.city': req.body.city,
                        'additional.state': req.body.state,
                        'additional.pc': req.body.pc,
                        'additional.INE': req.body.ine,
                        'auctionFolio': newUserFolio,
                        'isVerified': false,
                        'isAdmin': false
                    });
                    User.createUser(user, function(err, callback) {
                        if(err) throw(err);
                    });

                    const data = {
                        'user':req.body.email,
                        'pass':pwd
                    }

                    const mailElpolar = {
                        from: '"Asociación Ganadera Local de Chihuahua 🐮" <noreply@aglch.org>', 
                        to: req.body.email,
                        subject: "¡Tu nuevo usuario y contraseña te esperan!",
                        html: mail.elpolarMail(data)
                    };
                    mailTransporter.sendMail(mailElpolar);

                    req.flash('success_msg', '¡Te has registrado exitosamente!');
                    res.redirect('/login');
                }
            });   
        }
    });
}

exports.logoutUser = (req, res) => {

    req.logout();
    req.flash('error_msg', 'Has terminado tu sesión.');
    res.status(200).redirect('/');
}

exports.verifyUser = (req, res) => {
    jwt.verify(req.params.token, process.env.NOREPLY_PASS, (err, Id) => {
        if(err) {
          res.sendStatus(403);
        } else {
            id = Id.id;
            updateInfo = {"credentials.isVerified": true};
            User.findByIdAndUpdate(id, updateInfo, function (err, users) {
                if(!users){
                    res.status(404);
                }
                if (err){
                    res.status(500);
                }
                req.flash('success_msg', '¡Has confirmado tu correo electronico con éxito!');
                res.redirect('/login');
            });
        }
      });
}

// exports.create_User = (req, res) => {
    
//     const newUser = new User({
//         'name': '',
//         'surname': '',
//         'provider': 'local',
//         'email': 'prueba3@agrariumtech.com',
//         'password': '1234',
//         'additional.RFC': '',
//         'additional.phone': '',
//         'additional.address': '',
//         'additional.neighborhood': '',
//         'additional.city': '',
//         'additional.state': '',
//         'additional.pc': '',
//         'additional.INE': '',
//         'auctionFolio': 'A0003',
//         'isVerified': true,
//         'isAdmin': false
//     });
//     User.createUser(newUser, function(err, user){
//         if(err) throw(err);
//     });
// }

exports.forgot_Password = (req, res) => {
    req.checkBody('email').isEmail().withMessage('Dirección de correo inválida');
    const errors = req.validationErrors();
    if(errors) {
        res.render('../views/public/forgot', { errors: errors[0].msg });
    } else {
        User.findOne({ 'credentials.email': req.body.email }, (err, userExists) => {
            if(userExists) {
                jwt.sign(
                    {id: userExists._id},
                    process.env.NOREPLY_PASS,
                    { expiresIn: '1d' },
                    (err, token) => {
                        const url = process.env.DOMAIN + 'recover/' + token;
                        const mailForgot = {
                            from: '"Asociación Ganadera Local de Chihuahua 🐮" <noreply@aglch.org>', 
                            to: req.body.email,
                            subject: "Solicitud de contraseña nueva",
                            html: mail.forgotEmail(url)
                        };
                        mailTransporter.sendMail(mailForgot);
                    }
                );
                req.flash('success_msg', 'Por favor, revisa tu correo electronico para recuperar tu cuenta.');
                res.status(200).redirect('/login');
            } else {
                req.flash('error_msg', 'Por favor, ingresa un correo valido');
                res.status(200).redirect('/forgot');
            }
        });
    }
}

exports.recover_pasword = (req, res) => {
    req.checkBody('password').notEmpty().withMessage('Todos los campos son obligatorios');
    req.checkBody('confirmedPassword').notEmpty().withMessage('Todos los campos son obligatorios');
    req.checkBody('confirmedPassword').equals(req.body.password).withMessage('Las contraseñas no coinciden');
    req.checkBody('password').isLength({ min: 6 }).withMessage('Contraseña mínimo de 6 carácteres');
    req.checkBody('password').isLength({ max: 25 }).withMessage('Contraseña excede los 25 carácteres');

    const errors = req.validationErrors();  

    if(errors) {
        res.render('../views/public/recover/'+req.params.token, { errors: errors[0].msg });
    } else {
        jwt.verify(req.params.token, process.env.NOREPLY_PASS, (err, Id) => {
            if(err) {
              res.sendStatus(403);
            } else {
                id = Id.id;
                updateInfo = {"credentials.password": req.body.password};
                User.findByIdAndUpdate(id, updateInfo, function (err, users) {
                    if(!users){
                        res.status(404);
                    }
                    if (err){
                        res.status(500);
                    }
                    req.flash('success_msg', '¡Has actualizado tu contraseña con éxito!');
                    res.redirect('/login');
                });
            }
          });
    }
}

exports.send_contact_mail = (req, res) => {

    const data = {'name':req.body.name,
            'lastName':req.body.last,
            'email':req.body.email,
            'msg':req.body.message};

    const mailContact = {
        from: '"Asociación Ganadera Local de Chihuahua 🐮" <noreply@aglch.org>', 
        to:  'contacto@agrariumtech.com',
        subject: '¡Un cliente requiere atención! 📣😱',
        html: mail.contactMail(data)
    };
    
    mailTransporter.sendMail(mailContact);

    req.flash('success_msg', '¡Listo! Un miembro de nuestro equipo se pondrá en contacto via e-mail');
    res.status(200).redirect('/contact-us');
}

