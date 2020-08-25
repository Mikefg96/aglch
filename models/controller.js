'use strict'
const mongoose = require('mongoose'),
    controllerSchema = mongoose.Schema({
        subasta: String,
        loteActual: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'elpolar-lote' //TODO: Referencia global
        },
        actual: Number,
        ofertante: String,
        ofertar: Number
    });
module.exports = mongoose.model('controladore', controllerSchema);