'use strict'
const mongoose = require('mongoose'),
    genSchema = mongoose.Schema({
        abuelo_pa: String,
        abuela_pa: String,
        abuelo_ma: String,
        abuela_ma: String,
        padre: String,
        madre: String
    }),
    loteSchema = mongoose.Schema({
        lote: String,
        id_lote: String,
        cabezas: String,
        pesototal: Number,
        raza: String,
        precio: Number,
        aumento: Number,
        fotos: [{
            type: String
        }],
        deps: [{
            privado: String,
            pesonac: Number,
            pesodes: Number,
            pesoactual: Number,
            ce: Number
        }],
        genealogia: genSchema
    });
module.exports = mongoose.model('progen-lote', loteSchema);