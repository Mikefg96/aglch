const Controlador = require('../models/controller');
 
  /* ------------------------------
   |           GLOBALES           |
   ------------------------------ */
exports.create_AuctionController = (req, res) => {
    const controlador = new Controlador({
        subasta: '',
        loteActual: ''
    });
    controlador.save();
}
  /* ------------------------------
   |            PROGEN            |
   ------------------------------ */
const progen_Compra = require('../models/progen-sales'),
    progen_Lote = require('../models/progen-lotes');

exports.progen_renderAuction = (req, res) => {
    Controlador.findOne({ 'subasta': 'Progen' }).populate('loteActual').exec(function(err, controlador) {
		if(err) {
			throw(err);
		} else {
            progen_Lote.find(function(err, lotes) {
                if(err) {
                    throw(err);
                } else {
                    res.status(200).render('../views/livestream/auction', { controlador, lotes });
                }
            });
		}
	});	
}

exports.progen_renderMonitor = (req, res) => {
    Controlador.find().populate('loteActual').exec(function(err, controlador) {
        if(err) throw(err);
        progen_Lote.find(function(err, lotes) {
            if(err) throw(err);
            res.status(200).render('../views/livestream/progen-monitor', { controlador, lotes });
        });
    });
}

  /* ------------------------------
   |           EL POLAR           |
   ------------------------------ */
const elpolar_Compra = require('../models/elpolar-sales'),
    elpolar_Lote = require('../models/elpolar-lotes');
    
exports.elpolar_renderAuction = (req, res) => {
    Controlador.findOne({ 'subasta': 'El Polar' }).populate('loteActual').exec(function(err, controlador) {
        if(err) throw(err);
        elpolar_Lote.find(function(err, lotes) {
            if(err) throw(err);
            res.status(200).render('../views/livestream/auction', { controlador, lotes });
        }).sort({lote : 1});
    });
}

exports.elpolar_renderMonitor = (req, res) => {
    Controlador.findOne({ 'subasta': 'El Polar' }).populate('loteActual').exec(function(err, controlador) {
        if(err) throw(err);
        elpolar_Lote.find(function(err, lotes) {
            if(err) throw(err);
            res.status(200).render('../views/livestream/monitor', { controlador, lotes });
        }).sort({lote : 1});
    });
}

exports.elpolar_createLote = (req, res) => {
    const lote = new elpolar_Lote({
        lote: req.body.lote,
        id_lote: req.body.id_lote,
        cabezas: req.body.cabezas,
        // pesototal: req.body.pesototal,
        raza: req.body.raza,
        // precio: 37000,
        aumento: 0.10,
        // fotos: [
        //     ''
        // ],
        // deps: [{
        //     privado: req.body.privado,
        //     pesonac: req.body.pesonac,
        //     pesodes: req.body.pesodes,
        //     pesoactual: req.body.pesoactual,
        //     ce: req.body.ce
        // }],
        // 'genealogia.abuelo_pa': req.body.abuelo_pa,
        // 'genealogia.abuela_pa': req.body.abuela_pa,
        // 'genealogia.abuelo_ma': req.body.abuelo_ma,
        // 'genealogia.abuela_ma': req.body.abuela_ma,
        // 'genealogia.padre': req.body.padre,
        // 'genealogia.madre': req.body.madre
    });
    lote.save();
    req.flash('success_msg', '¡Se registró exitosamente el lote!');
    res.status(200).redirect('/event/aglch/registrar-lote');
}

exports.elpolar_createSale = (req, res) => {
/*  La función crea un nuevo registro de compra al finalizar la subasta de un lote.
    Si ya existe un registro de compra con el lote a generar, se borra el anterior y se crea
    uno nuevo. */
    const loteId = req.body.loteId,
        actual = req.body.actual,
        ofertante = req.body.ofertante;

    elpolar_Compra.findOne({ 'lote': loteId }, function(err, compra) {
        if(err) throw(err);
        if(!compra) {
            const nuevaCompra = new elpolar_Compra({
                lote: loteId,
                ofertante: ofertante,
                precio: actual
            });
            nuevaCompra.save();
            res.status(200).send({ ofertante: ofertante })
        } else {
            elpolar_Compra.findOneAndDelete({ 'lote': loteId }, function(err, callback) {
                if(err) throw(err);
                const nuevaCompra = new Compra({
                    lote: loteId,
                    ofertante: ofertante,
                    precio: actual
                });
                nuevaCompra.save();
                res.status(200).send({ ofertante: ofertante })
            });
        }
    });
}

exports.elpolar_renderDEP = (req, res) => {
    const loteId = req.params.loteId;

    elpolar_Lote.findById(loteId, function(err, lote) {
        if(err) throw(err);
        res.status(200).render('../views/livestream/dep', { lote });
    });
}

//TODO: Reubicar
exports.elpolar_renderLoteRegister = (req, res) => {

    res.status(200).render('../views/public/reg-lotes');
}


/**
 * DESMADRE DE LA GARZA TM
 */


//RENDERER
exports.renderControl = function (req, res) {
    res.status(200).render('../views/public/control.pug');
} 

exports.control_lotes = (req, res) => {
        elpolar_Lote.find(function(err, lotes) {
            if(err) throw(err);
            console.log(lotes);
            res.status(200).render('../views/public/control-edit', { lotes });
        }).sort({lote : 1});
}


exports.renderCambio = function (req, res) {
    res.status(200).render('../views/public/cambio-contra.pug');
} 

exports.cambio_contra = (req, res) => {
        elpolar_Lote.find(function(err, lotes) {
            if(err) throw(err);
            console.log(lotes);
            res.status(200).render('../views/public/cambio');
        }).sort({lote : 1});
}