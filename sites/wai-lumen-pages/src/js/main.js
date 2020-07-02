import 'bootstrap';
const bootstrap = require('./../css/bootstrap.min.css').toString();
const custom = require('./../css/fonts.css').toString();
const blog = require('./../css/main.css').toString();
console.log(blog);
console.log(bootstrap);
console.log(custom);

var $ =require('jquery');
$(document).ready(function() {

let loadHash=window.location.hash;
if (loadHash === ''){
    $('iframe.default-location').fadeIn();
    $('.default-location-btn').addClass('active');
}else{
    $('iframe'+loadHash).fadeIn();
    $(loadHash+'_btn').addClass('active');
}


function getLocationHash() {
    let hash=window.location.hash;
    $('iframe').hide();
    $('iframe'+hash).fadeIn();
    $('html, body').stop().animate({ 'scrollTop': 0 }, 1000)
    $('.text-muted').each(function(){
        $(this).removeClass('active');
    });
    $(hash+'_btn').addClass('active');
    var par = $(hash+'_btn').parent();
    var parClass = $(par).attr('class').includes("dropdown");
    if (parClass === true) {
        var prevPar = $(par).prev();
        console.log(prevPar);
        $(par).prev().addClass('active');
    };
}
window.onhashchange = function(e) {
  switch(getLocationHash()) {
    case 'state1':
      break;
    case 'state2':
      break;
    case 'state3':
      break;
    case 'state4':
      break;
    default:
      break;
  }
}

});

