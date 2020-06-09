/*
 *
 * Global Map Functions
 *
 */

var appVersion = 'v2019.02.27A';
if (localStorage.getItem('app-version') !== appVersion) {
    window.localStorage.clear();
    localStorage.setItem('app-version', appVersion);
}

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

// pop up details
function getDetails(a, atype) {
    console.log(a);
    console.log(a.getAttribute('data'));
    $('#profile-menu').click();
    $('#detail_modal').modal('show');
}


function focusTo() {
    event.preventDefault()
    let latlng = $('#zoom_find').val();
    let id = $('#find').attr('data-search');
    latlng = latlng.split(',');
    latlng = [parseFloat(latlng[0]), parseFloat(latlng[1])];
    maps.setView(new L.LatLng(latlng[0], latlng[1]), 18);
    getDetails(id, 'id');
}

function focusNormal() {
    maps.setView(new L.LatLng(-8.3626894, 160.3288342), 7);
}

function jqUI() {
    $("#find").autocomplete({
            minLength: 4,
            source: function(request, response) {
                $.getJSON('/api/search/' + request.term, {}, response);
            },
            focus: function(event, ui) {
                $("#find").val(ui.item.school);
                $("#find").attr('data-search', ui.item.identifier);
                $("#zoom_find").val([ui.item.latitude, ui.item.longitude]);
                return false;
            },
            select: function(event, ui) {
                $("#find").val(ui.item.school);
                return false;
            }
        })
        .autocomplete("instance")._renderItem = function(ul, item) {
            var schoolType = item.school_type
            if (schoolType === null) {
                schoolType = item.school_type_other;
            }
            return $("<li>")
                .append("<div><span class='search-province'>" + item.school + " - " + item.province + "</span><span class='badge badge-small badge-primary'>" + schoolType + "</span></div>")
                .appendTo(ul);
        };
}

function toggleLegend(it, state) {
    let rem_class = $(it).attr('class');
    $('.marker.' + rem_class).hide();
}

function restartCluster(el, key) {
    var filter = $(el).attr('class').split(' ')[0];
    $('.marker .' + filter).remove();
}

function downloadData() {
}

function exportExcel(filter) {
    var CsvString = "";
    var headers = JSON.parse(localStorage.getItem('raw-data-header'));
    var allText = localStorage.getItem('raw-data');
    var lines = [];
    lines.push(headers);
    var allTextLines = allText.split(/\r\n|\n/);
    if (filter.length > 0) {
        for (var i = 1; i < allTextLines.length; i++) {
            var data = allTextLines[i].split(',');
            if (filter.includes(data[0])) {
                lines.push(data);
            }
        }
    } else {
        for (var i = 1; i < allTextLines.length; i++) {
            var data = allTextLines[i].split(',');
            lines.push(data);
        }
    }
    lines.forEach(function(RowItem, RowIndex) {
        RowItem.forEach(function(ColItem, ColIndex) {
            CsvString += ColItem + ',';
        });
        CsvString += "\r\n";
    });
    CsvString = "data:application/csv;charset=utf-8," + encodeURIComponent(CsvString);
    var x = document.createElement("A");
    x.setAttribute("href", CsvString);
    var d = new Date();
    x.setAttribute("download", "wins-"+ d.toISOString() +".csv");
    document.body.appendChild(x);
    x.click();
    $(x).remove();
}

function showSecurityForm() {
    $('#security_modal').modal('show');
};

function sendRequest() {
    var input_security = $('#secure-pwd').val();
    $.ajax({
        type: "POST",
        url: "/api/verify",
        data: {
            "security_code": input_security,
        },
        dataType: "json",
        success: function() {
            downloadData();
        },
        error: function() {
            $('#error-download').slideDown("fast");
            $('#secure-pwd').addClass("is-invalid");
            setTimeout(function() {
                $('#error-download').slideUp("fast");
                $('#secure-pwd').removeClass("is-invalid");
            }, 3000);
        }
    });
}

