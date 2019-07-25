import 'jquery';
import './../node_modules/popper.js/dist/popper.min.js';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './../src/custom.css';

var $ = require('jquery');

function showModal(x){
    $('#modalTitle').text(x);
    $('#myModal').modal('show');
}

$('a.showing-modal').click(function(){
    let btn = this;
    let dataId = $(btn).attr('data-id');
    showModal(dataId);
    console.log(dataId);
});
