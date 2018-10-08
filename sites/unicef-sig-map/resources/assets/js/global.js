/*
 *
 * Global Map Functions
 *
 */

let maps;

var nainclude = [
	'identifier',
	'latitude',
	'longitude',
	'elevation',
	'display name',
	'device identifier',
	'instance',
	'submission date',
	'submitter',
	'duration'
];

var qgroup = [
    {'n':'Interview Details','q': 10},
    {'n':'School Information','q': 13},
    {'n':'Water Supply','q': 20},
    {'n':'Sanitation','q':31},
    {'n':'Hygiene','q':9},
    {'n':'School Management','q':42},
    {'n':'Teacher','q':3},
    {'n':'Head Teacher','q':4},
    {'n':'Geolocation','q':1}
];

function getDetails(a, atype) {
    let id;
    if (atype === 'id'){
        id = a;
    }else{
	    id = $(a).attr('data');
    }
    $.get('/api/details/'+ id ).done(function(data){
		$('#school_name').text(data['name of school?']);
		$('#school_desc').children().remove();
		$('#school_feature').children().remove();
		Object.keys(data).forEach(function (key) {
			var features = nainclude.includes(key);
			if (!features) {
				if (data[key]){
					let body;
					var str = data[key];
                    if(!isNaN(str)){
                        if (str < 1){
                            key = "<i class='fas fa-exclamation circle'></i> " + key;
                            body = "<div class='badge badge-secondary'>Not Answering</div>";
                        } else {
                            key = "<i class='fas fa-hashtag'></i> " + key;
                            body = "<div class='badge badge-warning'>" + str + "</div>";
                        }
                    } else if (str.startsWith("https://")){
						body = "<img src='"+data[key]+"' class='img-fluid img-thumbnail rounded'>";
                        key = "<i class='fas fa-camera'></i> " + key;
					} else if(str.startsWith("Yes")){
                        key = "<i class='fas fa-list-ul'></i> " + key;
						body = "<div class='badge badge-success'>" + str + "</div>";
					} else if(str.startsWith("No")){
                        key = "<i class='fas fa-list-ul'></i> " + key;
						body = "<div class='badge badge-danger'>" + str + "</div>";
                    } else {
                        key = "<i class='fas fa-align-justify'></i> " + key;
						body = "<div class='badge badge-primary'>" + str + "</div>";
					}
                    $('#school_desc').append(
                        "<div class='card card-custom'><div class='card-body'><div class='card-title'>" +
                        key + "</div><div class='card-text'>" + body + "</div></div></div>"
                    );
				};
			}
		});
		$('#detail_modal').modal('show');
    });
}

function getGroup(x,y) {
}

function autoQuestion() {
    // Declare variables
    var input, filter, ul, li, a, i;
    input = document.getElementById('myInput');
    filter = input.value.toUpperCase();
    ul = $('#school_detail');
 	card = $('div.card');
    li = $('div.card-body');

    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("div")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            card[i].style.display = "";
        } else {
            card[i].style.display = "none";
        }
    }
}

function autoAnswer() {
    // Declare variables
    var input, filter, ul, li, a, i;
    input = document.getElementById('myOutput');
    filter = input.value.toUpperCase();
    ul = $('#school_detail');
 	card = $('div.card');
    li = $('div.card-text');

    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("div")[0];
		if(a){
			if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
				card[i].style.display = "";
			} else {
				card[i].style.display = "none";
			}
		}
	}
}

function focusTo() {
    event.preventDefault()
    let latlng = $('#zoom_find').val();
    let id= $('#find').attr('data-search');
    latlng = latlng.split(',');
    latlng = [parseFloat(latlng[0]), parseFloat(latlng[1])];
    maps.setView(new L.LatLng(latlng[0],latlng[1]), 18);
    getDetails(id, 'id');
}

function focusNormal() {
    maps.setView(new L.LatLng(-8.19,158.55), 7);
}

function jqUI(){
    $("#find").autocomplete({
      minLength: 4,
      source: function(request, response) {
          $.getJSON( '/api/search/' + request.term, {
          }, response );
      },
      focus: function( event, ui ) {
        $( "#find" ).val( ui.item.school);
        $( "#find" ).attr('data-search', ui.item.identifier);
        $( "#zoom_find" ).val([ui.item.latitude, ui.item.longitude]);
        return false;
      },
      select: function( event, ui ) {
        $( "#find" ).val( ui.item.school);
        return false;
      }
    })
    .autocomplete("instance")._renderItem = function( ul, item ) {
      return $( "<li>" )
        .append( "<div>" + item.school + "<span class='badge badge-small badge-primary'>" + item.identifier + "</span></div>" )
        .appendTo( ul );
    };
}

function toggleLegend(it, state) {
    let rem_class = $(it).attr('class');
    $('.marker.'+rem_class).hide();
}

function restartCluster(el, key) {
    var filter = $(el).attr('class').split(' ')[0];
    $('.marker .' + filter).remove();
}


/*
 *
 * Global Database Function
 *
 */
