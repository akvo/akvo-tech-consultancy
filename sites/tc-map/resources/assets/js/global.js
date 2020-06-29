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
let customs;

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

const getTemplate = () => {
    let data = JSON.parse(localStorage.getItem('data'));
    const template = customs.custom(data);
    let js = localStorage.getItem("template");
    return (js === null) ? false : template[js];
};

// pop up details
const getDetails = (a, atype) => {
    let template = getTemplate();
    if (atype === 0) {
        let datapointid = $(a).attr('data');
    }
    if (atype === 'id') {
        let datapointid = a;
    }
    template.popup(datapointid);
    $('#profile-menu').click();
    $('#detail_modal').modal('show');
};

const focusTo = () => {
    event.preventDefault()
    let latlng = $('#zoom_find').val();
    let id = $('#find').attr('data-search');
    latlng = latlng.split(',');
    latlng = [parseFloat(latlng[0]), parseFloat(latlng[1])];
    maps.setView(new L.LatLng(latlng[0], latlng[1]), 18);
    getDetails(id, 'id');
};

const focusNormal = () => {
    maps.setView(new L.LatLng(-8.3626894, 160.3288342), 7);
};

const searchData = (request) => {
    let configs = JSON.parse(localStorage.getItem('configs'));
    let data = JSON.parse(localStorage.getItem('data'));
    let properties = _.map(data.features, (x) => x.properties);
    let search = [];
    _.forEach(configs['search'], (x) => {
        _.forEach(properties, (y) => {
            if (y[x].toLowerCase().includes(request.term.toLowerCase())) {
                y.searchKey = x;
                y.popup = configs['popup'];
                search.push(y);    
            }
        });
    });
    return search;
};

const jqUI = () => {
    $("#find").autocomplete({
        minLength: 4,
        source: (request, response) => {
            response(searchData(request));
        },
        focus: (event, ui) => {
            $("#find").val(ui.item[ui.item.searchKey]);
            $("#find").attr('data-search', ui.item.data_point_id);
            $("#zoom_find").val(ui.item.PTS);
            return false;
        },
        select: (event, ui) => {
            console.log(ui);
            $("#find").val(ui.item[ui.item.searchKey]);
            return false;
        }
    })
    .autocomplete("instance")._renderItem = (ul, item) => {
        // if (schoolType === null) {
        //     schoolType = item.school_type_other;
        // }
        return $("<li>")
            .append("<div><span class='search-province'>" + item[item.popup] + " - xxx </span><span class='badge badge-small badge-primary'>"+ item[item.searchKey] +"</span></div>")
            .appendTo(ul);
    };
};

const toggleLegend = (it, state) => {
    let rem_class = $(it).attr('class');
    $('.marker.' + rem_class).hide();
};

const restartCluster = (el, key) => {
    var filter = $(el).attr('class').split(' ')[0];
    $('.marker .' + filter).remove();
};

const downloadData = () => {
    console.log('Download data', maps);
};

const exportExcel = (filter) => {
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
    lines.forEach((RowItem, RowIndex) => {
        RowItem.forEach((ColItem, ColIndex) => {
            CsvString += ColItem + ',';
        });
        CsvString += "\r\n";
    });
    CsvString = "data:application/csv;charset=utf-8," + encodeURIComponent(CsvString);
    var x = document.createElement("A");
    x.setAttribute("href", CsvString);
    var d = new Date();
    x.setAttribute("download", "wins-" + d.toISOString() + ".csv");
    document.body.appendChild(x);
    x.click();
    $(x).remove();
};

const showSecurityForm = () => {
    $('#security_modal').modal('show');
};

const sendRequest = () => {
    var input_security = $('#secure-pwd').val();
    $.ajax({
        type: "POST",
        url: "/api/verify",
        data: {
            "security_code": input_security,
        },
        dataType: "json",
        success: () => {
            downloadData();
        },
        error: () => {
            $('#error-download').slideDown("fast");
            $('#secure-pwd').addClass("is-invalid");
            setTimeout(() => {
                $('#error-download').slideUp("fast");
                $('#secure-pwd').removeClass("is-invalid");
            }, 3000);
        }
    });
};
