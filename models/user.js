/*  ¿Qué se ve afectado por el refactor del modelo del usuario?
        1. Verificación del corrreo electrónico
        2. Página de perfil y configuración del usuario 
    Ambos puntos se encuentan TEMPORALMENTE en desuso, por lo cual no es prioridad
    arreglar su funcionalidad. 
*/

'use strict'
const bcrypt = require('bcryptjs'),
    mongoose = require('mongoose'),
    auctionSchema = mongoose.Schema({
        RFC: String,
        phone: String,
        address: String,
        neighborhood: String,
        city: String,
        state: String,
        pc: String,
        INE: String,
    }),
    userSchema = mongoose.Schema({
        name: String,
        surname: String,
        provider: String,
        email: {
            type: String,
            lowercase: true
        },
        password: String,
        additional: auctionSchema,
        auctionFolio: String,
        isVerified: Boolean,
        isAdmin: Boolean
    });

module.exports = mongoose.model('usuario', userSchema);

module.exports.createUser = function(newUser, callback) {
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) { throw(err); }
    	callback(null, isMatch);
	});
}

/* 
    ObjectID consists of 12 bytes. 
    The first four are reserved for a time stamp in which the document was created. In other words, 
    the ‘created_at’ field is already encoded in your automatically generated ID. 
    The next three bytes are machine identifiers, 
    which is used to differentiate two machines writing different documents 
    to the database to ensure the generation of different IDs to avoid clashes. 
    Then the remaining 3 bytes are a counter which is randomly generated.

    --> DEMO
    db.collection('Products').insertOne({
        name: 'iPhone X',
        trademark: 'Apple'
    }, (err, result) => {
        if (err) return console.log(err);

        console.log(result.op[0]._id.getTimeStamp());
    });
    https://medium.com/@es1amaged/stop-using-created-at-with-mongodb-a9d03e6b5385
*/