'use strict'
const mongoose = require('mongoose'),
    progenSalesSchema = mongoose.Schema({
        lote: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'progen-lote'
        },
        ofertante: String,
        precio: Number
    });
module.exports = mongoose.model('progen-venta', progenSalesSchema);