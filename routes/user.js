/*
ensureAuthenticated: Verifica si existe un usuario en la sesión.
isProfileOwner: Verifica si el usuario coincide con el req.params.user_id.
*/

const express = require('express'),
    controller = require('../controllers/user');

const router = express.Router();

router.get('/:user_id', controller.renderProfile);
router.get('/settings/:user_id',
    controller.ensureAuthenticated,
    controller.isProfileOwner, 
    controller.renderProfileSettings);

router.post('/settings/:user_id',
    controller.ensureAuthenticated,
    controller.isProfileOwner,
    controller.saveProfileSettings);

router.get('/publish/:user_id',
    controller.ensureAuthenticated,
    controller.isProfileOwner,
    controller.renderCreatePublication);
    
module.exports = router;