var socket = io();

function getLoteId() {
    var loteId = document.getElementById('lote-select').value;

    socket.emit('update current lote', loteId);
}

$('#ofertar-btn').click(function() {
    var actual = $('#ofertar-value').text();

    socket.emit('nuevaOferta', {
        actual: actual.slice(1),
        aumento: $('#aumento').text(),
        ofertante: $('#userFolio').text()
    });
});

$('#admin-price-btn').click(function() {
    var precioInicial = $('#admin-price-input').val();

    socket.emit('precio inicial', precioInicial);
});

$('#admin-weight-btn').click(function() {
    var peso = $('#admin-weight-input').val();

    socket.emit('peso', peso);
});

$('#admin-oferta-local').click(function() {
    var actual = $('#ofertar-value').text();

    socket.emit('nuevaOferta', {
        actual: actual.slice(1),
        aumento: $('#aumento').text(),
        ofertante: 'LOCAL'
    });
});

$('#admin-fin').click(function() {
    const loteId = document.getElementById('lote-select').value,
        actual = $('#progen-actual').text(),
        ofertante = $('#progen-ofertante').text();
        
    $.ajax({
        type: "POST",
        url: '/event/elpolar/finalizar-compra',
        data: { loteId: loteId, actual: actual.slice(1), ofertante: ofertante },
        success: function(data, textStatus, request) {
            socket.emit('cerrar lote');
            alert('¡Registro guardado exitosamente en la base de datos!\nVendido al ofertante ' + data.ofertante + '.');
        },
        error: function() {
            alert('Hubo un error al tratar de guardar el registro de compra en la base de datos.')
        }
      });
});

/* ------------------------------
   |        SOCKETS.ON          |
   ------------------------------ */
socket.on('update current lote', function(data) {

    console.log(data);

    var pesoPromedio = (Math.round((data.pesototal / data.cabezas)*100)/100);
    var dep = document.getElementById('dep');

    $("#ofertar-btn").attr("disabled", true);

    $('#id_lote').text(data.id_lote);
    $('#progen-lote').text(data.lote);
    $('#progen-cabezas').text(data.cabezas);
    if(data.pesototal == null) {
        $('#progen-pesototal').text('-');
        $('#progen-pesoprom').text('-');
    } else {
        $('#progen-pesototal').text(data.pesototal + 'kg');
        $('#progen-pesoprom').text(pesoPromedio + 'kg');
    }
    $('#progen-raza').text(data.raza);

    $('#progen-actual').text('');
    $('#progen-ofertante').text('');
    $('#ofertar-value').text('');
    // $('#ofertar-value').text('$' + data.precio);

    $('#aumento').text(data.aumento);
    
    for(var i = 0; i < data.fotos.length; i++) {
        $('#progen-' + (i + 1)).attr('src', data.fotos[i]);
    }

    dep.href = '/event/elpolar/lote/' + data._id
});

socket.on('nuevaOferta', function(nuevaOferta) {
    var precioAumentado = parseFloat(nuevaOferta.actual) + parseFloat(nuevaOferta.aumento),
        userFolio = $('#userFolio').text();

    var roundedPrice = Math.round(precioAumentado * 100) / 100;

    if(userFolio == nuevaOferta.ofertante) {
        $("#ofertar-btn").attr("disabled", true);
    } else {
        $("#ofertar-btn").attr("disabled", false);
    }

    $('#progen-actual').text('$' + nuevaOferta.actual);
    $('#progen-ofertante').text(nuevaOferta.ofertante);
    $('#ofertar-value').text('$' + roundedPrice);
    // $('#progen-admin-precio').val(nuevaOferta.actual);
});

socket.on('cerrar lote', function() {
    $("#ofertar-btn").attr("disabled", true);
    $('#ofertar-value').text('CERRADO');
});

socket.on('precio inicial', function(precioInicial) {
    $("#ofertar-btn").attr("disabled", false);
    $('#ofertar-value').text('$' + precioInicial);
}); 

socket.on('peso', function(peso) {
    $('#progen-pesototal').text(peso + 'kg');

    var cabezas = $('#progen-cabezas').text();
    var pesoProm = (Math.round(peso / parseInt(cabezas)*100)/100);

    $('#progen-pesoprom').text(pesoProm + 'kg'); 
}); 