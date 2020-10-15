const custom = require('./custom.js'); 
const _ = require('lodash');
const axios = require('axios');

/* Global Variabel */
let appVersion = localStorage.getItem('app-version'),
    defaultSelect = localStorage.getItem('default-api'),
    defaultSurvey = localStorage.getItem('default-survey'),
    geojsonPath = '/api/data/';

const fetchAPI = (endpoint) => {
    return new Promise((resolve, reject) => {
        axios.get('/api/' + endpoint).then(res => {
            resolve(res);
        }).catch(e => {
            reject(e);
        });
    });
};

const setSelectedCategory = (id) => {
    let selected = false;
    let tagselected = "";
    if (defaultSelect === id.toString()) {
        selected = true;
    }
    if (selected) {
        tagselected = "selected";
    }
    return tagselected;
};

/* set category selected based on data load */    
const fetchdata = () => {
    fetchAPI('source').then((a) => {
        $('#category-dropdown').html('');
        if (!defaultSelect) {
            $('#category-dropdown').append('<option id="source-init" value=0 selected>SELECT SURVEY</option>');
            // emptyMap();
        }
        a.data.forEach((x, i) => {
            $('#category-dropdown').append('<optgroup label="'+ x["source"].toUpperCase() +'" id='+ x["id"] +'></optgroup>');
            let timestamp = Date.parse(x.created_at);
            if (x.childrens.length > 0) {
                x.childrens.forEach((y, i) => {
                    let selected = setSelectedCategory(y["id"]);
                    let id = "#" + x["id"];
                    $(id).append('<option version='+ timestamp +' surveyid='+ y["parent_id"] +' value='+ y["id"] +' '+ selected + '>' + y["source"].toUpperCase() + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</option>');

                    if (y.childrens.length > 0) {
                        y.childrens.forEach((z, i) => {
                            let selected = setSelectedCategory(z["id"]);
                            $(id).append('<option version='+ timestamp +' surveyid='+ y["parent_id"] +' value='+ z["id"] +' '+ selected + '>' + z["source"].toUpperCase() + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</option>');
                        });
                    }
                });
            }
            geojsonPath = '/api/data/' + defaultSelect;
        });
        if (defaultSelect) {
            // check data version
            let activeSurvey = a.data.filter(x => x.id == defaultSurvey)[0];
            let newVersion = Date.parse(activeSurvey.created_at);
            if (appVersion != newVersion) {
                // window.localStorage.clear();
                localStorage.removeItem('data');
                localStorage.removeItem('default-properties');
                localStorage.removeItem('configs');
                localStorage.removeItem('second-filter');
                localStorage.setItem('app-version', newVersion);
            }
        }
        return defaultSelect;
    }).then(val => {
        if (val) {
            $("#pre-loader").fadeOut('slow');
            // (localStorage.getItem('data')) ? loadLocalData() : setConfig(val);
            (localStorage.getItem('data')) ? $("#databaseNav").removeClass('hidden') : window.location.replace(window.location.origin);
        }
    });
};
// fetchdata();

(localStorage.getItem('data')) ? $("#databaseNav").removeClass('hidden') : window.location.replace(window.location.origin);
var frm = $("form#stack_search");
$(frm).removeAttr('onsubmit');

var btn4 = $('#stack_search a:last-child');
$(btn4).removeAttr('onclick');

function icon(fa) {
    return "<i class='fa fa-"+fa+"'></i>";
}

const getColumns = () => {
    let config = JSON.parse(localStorage.getItem('configs'));
    config = _.omit(config, [
        'center', 'css', 'js', 'name', 'popup', 'search', 'shapefile', 'shapename'
    ]);
    let columns = [];
    for (const index in config) {
        columns.push({
            title: config[index], 
            searchable: true,
            orderable: true,
        });
    }
    return columns;
};

const getData = () => {
    let data = JSON.parse(localStorage.getItem('data'));
    data = data.features.map(x => {
        let temp = [];
        let object = _.omit(x.properties, ['PTS', 'status']);
        for (const index in object) {
            temp.push(x.properties[index]);
        }
        return temp;
    });
    $("#pre-loader").fadeOut('slow');
    return data;
};

$.fn.dataTable.Buttons.defaults.dom.button.className = 'btn btn-light my-2 my-sm-0';

var data_table = $('#databaseDataTable').DataTable({
    pageLength:10,
    autoWidth: false,
	processing: true,
    data: getData(),
    columns: getColumns(),
    lengthMenu: [
        [ 10, 25, 50, 100, -1 ],
        [ '10 rows', '25 rows', '50 rows', '100 rows', 'Show all' ]
    ],
	dom: 'Brtpi',
    buttons: [
        // { extend: 'print',
        //   text: icon('print'),
        //   key: { key: 'p', altkey: true }
        // },
        { extend: 'excel',
          text: icon('file-excel-o'),
          key: { key: 'x', altkey: true }
        },
        // { extend: 'pdf',
        //   text: icon('file-pdf-o'),
        //   key: { key: 'd', altkey: true }
        // },
        { extend: 'csv',
          text: icon('file-text-o'),
          key: { key: 'c', altkey: true }
        },
        { extend: 'colvis', fade:0, text: icon('table')},
        { extend: 'pageLength', fade:0},
    ],
    scrollX: true,
    scrollY: '75vh',
    height: 400,
    fixedHeader: true,
    scrollCollapse: true,
    columnDefs: [
        { targets: [0,1,2,3,4,5,6,7,8,9],
          visible: true,
        },
        { targets: '_all',
          visible: false,
        }
    ],
	initComplete: function () {
		$('.dt-buttons.btn-group').prependTo('.form-inline');
		$('.dt-buttons.btn-group').show();
	}
});

$("#find").removeAttr('onkeydown');
$('#databaseDataTable tbody').on('click', 'tr', function (e) {
    var data = data_table.row(this).data();
	getDetails(data[data.length-1],'id');
});

$(btn4).on('click', function () {
	searchTable();
    var column = data_table.column( $(this).attr('data-column') );
    column.visible( ! column.visible() );
});

$(frm).on('submit', function() {
    event.preventDefault()
	searchTable();
});

function searchTable(){
	let search_val = $('#find').val();
	data_table.search(search_val).draw();
}

customs = custom;