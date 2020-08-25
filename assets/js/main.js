$(document).ready(function(){

    var path = window.location.pathname;

    if(path == '/event/progen') {
        $('#navbar').css('display', 'none');
        $('#body').css('background-color', '#EEEEEE')
    } else if(path == '/event/progen/monitor') {
        $('#navbar').css('display', 'none');
        $('#body').css('background-color', '#EEEEEE')
    } else if(path.slice(0, -25) == '/event/elpolar/lote') {
        $('#navbar').css('display', 'none');
    } else if(path == '/event/aglch') {
        $('#navbar').css('display', 'none');
        $('#body').css('background-color', '#EEEEEE')
    }
});

function countChar(val) {
    var len = val.value.length;
    if (len > 250) {
        val.value = val.value.substring(0, 250);
    } else {
        $('#textarea-limited-message').text(250 - len + ' carácteres disponibles');
    }
};