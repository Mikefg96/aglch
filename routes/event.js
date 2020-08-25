const express = require('express'),
    controller = require('../controllers/event');
    
const router = express.Router();

router.post('/create/controlador', controller.create_AuctionController);
  /* ------------------------------
   |            PROGEN            |
   ------------------------------ */
// router.get('/progen', controller.progen_renderAuction);
// router.get('/progen/monitor', controller.progen_renderMonitor);

 /* ------------------------------
   |           EL POLAR           |
   ------------------------------ */
router.get('/aglch', controller.elpolar_renderAuction);
router.get('/elpolar/monitor', controller.elpolar_renderMonitor);
router.get('/elpolar/lote/:loteId', controller.elpolar_renderDEP);
router.get('/aglch/registrar-lote', controller.elpolar_renderLoteRegister);

/*andrea*/
router.get('/control',controller.renderControl);
router.get('/control-lotes',controller.control_lotes);

router.post('/elpolar/registrar-lote', controller.elpolar_createLote);
router.post('/elpolar/finalizar-compra', controller.elpolar_createSale);

router.get('/cambio',controller.renderCambio);
router.get('/cambio-contra',controller.cambio_contra);



module.exports = router;