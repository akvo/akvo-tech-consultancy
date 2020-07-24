import 'bootstrap';
const bootstrap = require('./../css/bootstrap.min.css').toString();
const custom = require('./../css/fonts.css').toString();
const blog = require('./../css/main.css').toString();
// console.log(blog);
// console.log(bootstrap);
// console.log(custom);

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
  showEachIslandSelect();
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

var options = [
  {
    id : 1,
    name : "Matuku",
    link : "https://ci-fiji.akvolumen.org/s/70sgZGBML2g"
  },
  {
    id : 2,
    name : "Vatoa",
    link : "https://ci-fiji.akvolumen.org/s/64HSeeaYNXo"
  },
  {
    id : 3,
    name : "Totoya",
    link : "https://ci-fiji.akvolumen.org/s/iF1wX2TXADU"
  },
  {
    id : 4,
    name : "Ono",
    link : "https://ci-fiji.akvolumen.org/s/9zBbphAzNLY"
  },
  {
    id : 5,
    name : "Ogea",
    link : "https://ci-fiji.akvolumen.org/s/RHw7VPYDpKo"
  },
  {
    id : 6,
    name : "Moala",
    link : "https://ci-fiji.akvolumen.org/s/Ky7u69dooD4"
  },
  {
    id : 7,
    name : "Kabara",
    link : "https://ci-fiji.akvolumen.org/s/0TykcSzrXHQ"
  },
  {
    id : 8,
    name : "Fulaga",
    link : "https://ci-fiji.akvolumen.org/s/cCAYpxrzYVY"
  }
];

var selected = 1
function appendEachIslandSelect() {
  options.forEach(x => {
    var active = (x.id === parseInt(selected)) ? "selected" : "";
    $("#each-island-select").append('<option value="'+x.id+'" '+active+'>'+x.name+'</option>');
  });
}
appendEachIslandSelect();

$("#each-island-select").on('change', function(x) {
  selected = parseInt(this.value);
  setEachIslandLink(this.value);
});

function setEachIslandLink(id) {
  var option = options.filter(function(x) {
    return x.id === parseInt(id);
  });
  $("#each-island").attr("src", option[0].link);
}
setEachIslandLink(selected);

function showEachIslandSelect() {
  var url      = window.location.href;
  var location = url.split("/")[3];
  (location === "#each-island" || location === "") ? $("#each-island-select-wrapper").show() : $("#each-island-select-wrapper").hide();
}
showEachIslandSelect();

});

