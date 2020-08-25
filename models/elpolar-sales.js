'use strict'
const mongoose = require('mongoose'),
    elpolarSalesSchema = mongoose.Schema({
        lote: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'elpolar-lote'
        },
        ofertante: String,
        precio: Number
    });
module.exports = mongoose.model('elpolar-venta', elpolarSalesSchema);