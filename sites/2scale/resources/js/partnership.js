import { db, storeDB } from './dexie';
const axios = window.axios;
import {getCharts, getCards, getSingleCards} from './charts.js';

/* Static */
const country_id = $("meta[name='country']").attr("content");
const partnership_id = $("meta[name='partnership']").attr("content");
const start_date = $("meta[name='start-date']").attr("content");
const end_date = $("meta[name='end-date']").attr("content");
const endpoints = [country_id, partnership_id, start_date, end_date].join('/');

/* Static */
const info = {
    head: "Header Lorem Ipsum",
    content: "Lorem Ipsum Dolor Sit Amet for Footer"
};

getCards('partnership/top-three/' + endpoints);

/* First Row */
$("main").append("<div class='row' id='first-row'></div>");
getCharts('partnership/commodities/' + endpoints, 'first-row', info, "12");

/* Second Row */
$("main").append("<hr><div class='row' id='second-row'></div>");
getCharts('partnership/countries-total/' + endpoints, 'second-row', info, "6");
getCharts('partnership/project-total/' + endpoints, 'second-row', info, "6");

// Table container
$("main").append('<hr><div class="table-wrapper-scroll-y my-custom-scrollbar" style="margin-top:25px; margin-bottom:25px;">\
        <div id="table-container">\
            <table id="datatables" class="table table-bordered" style="width:100%" cellspacing="0"></table>\
        </div>\
        <div id="datatableWrapper" class="tab-content"></div>\
    </div>');

// put a div (hidden) to store the charts for pdf report
$("main").append("<div id='chart-report-container' class='invisible' style='margin-top:-999rem'></div>");

$("#chart-report-container").append("<hr><div class='row' id='third-row'></div>");
getSingleCards('report/reachreact/card/' + endpoints, 'third-row');

$("#chart-report-container").append("<hr><div class='row' id='fourth-row'></div>");
getCharts('report/work-stream/' + endpoints, 'fourth-row', info, "12");

$("#chart-report-container").append("<hr><div class='row' id='fifth-row'></div>");
// getCharts('report/program-theme/' + endpoints, 'fifth-row', info, "12");
getCharts('report/program-theme/' + endpoints, 'fifth-row', info, "6");
getCharts('report/target-audience/' + endpoints, 'fifth-row', info, "6");


// $("#chart-report-container").append("<hr><div class='row' id='sixth-row'></div>");
// getCharts('report/target-audience/' + endpoints, 'sixth-row', info, "12");

$("#chart-report-container").append("<hr><div class='row' id='seventh-row'></div>");
getCharts('reachreact/gender/' + endpoints, 'seventh-row', info, "12");

// $("main").append("<hr><div class='row' id='fourth-row'></div>");
// getCharts('reachreact/gender-total/' + endpoints, 'fourth-row', info, "6");
// getCharts('reachreact/country-total/' + endpoints, 'fourth-row', info, "6");

// $("main").append("<hr><div class='row' id='fourth-row'></div>");
// getCharts('test/'+ endpoints, 'fourth-row', info, "12");

const table = db.databases;
const fetchData = (endpoint) => {
    return new Promise((resolve, reject) => {
        axios.get('/charts/test/' + endpoint) .then(res=> {
            // console.log('fetch network', res);
            // storeDB({
                //     table : table, data : {name: endpoint, data: res.data}, key : {name: endpoint}
                // });
                resolve(res.data);
            }).catch(error=> {
                reject(error);
            });
        });
    };
    
// load from dixie if exist
const loadData = async (endpoint) => {
    const res = await table.get({name: endpoint});
    if (res === undefined) {
        return fetchData(endpoint);
    }
    console.log('not fetch network', res);
    return res.data;
}
const getData=loadData([country_id, partnership_id].join('/'));

let html = '';
let shown = null;
getData.then(res => {
    console.log(res);
    localStorage.removeItem('dtcache');
    html += '<thead>';
    html += '<tr>';
    // html += '<th rowspan="2"></th>'
    html += '<th rowspan="2"></th>';
    res.columns.forEach(column => {
        html += '<th colspan="2">'+column+'</th>';
    });
    html += '</tr>';
    return res;
}).then(res => {
    html += '<tr>';
    res.columns.forEach(column => {
        html += '<th class="text-center">Target</th>';
        html += '<th class="text-center">Actual</th>';
    });
    html += '</tr>';
    html += '</thead>';
    return res;
}).then(res => {
    let dtcache = [];
    html += '<tbody>';
    res.data.forEach(val => {
        let css = (val.childrens.length > 0) ? 'parent' : '';
        dtcache.push({'id': val.rsr_project_id, 'columns': val.columns});
        html += '<tr data-value='+val.rsr_project_id+' style="background-color:#E2E3E5;">';
        // html += '<td class="details-control"></td>';
        html += '<td class="'+css+'">'+val.project+'</td>';
        val.columns.forEach(val => {
            let has_dimension = (val.rsr_dimensions.length > 0) ? 'has-dimension' : '';
            html += "<td class='"+css+" text-right "+has_dimension+"' data-details='"+JSON.stringify(val)+"'>";
            html += val.total_target_value;
            html += "</td>";
            html += "<td class='"+css+" text-right "+has_dimension+"' data-details='"+JSON.stringify(val)+"'>";
            html += val.total_actual_value;
            html += "</td>";
        });
        html += '</tr>';
        if (val.childrens.length > 0) {
            val.childrens.forEach(val => {
                css = (val.childrens.length > 0) ? 'parent' : '';
                let bgcolor = (val.childrens.length > 0) ? 'style="background-color:#F2F2F2;"' : '';
                dtcache.push({'id': val.rsr_project_id, 'columns': val.columns});
                html += '<tr data-value='+val.rsr_project_id+' '+bgcolor+'>';
                // html += '<td class="details-control"></td>';
                html += '<td class="'+css+'" style="padding-left:20px;">'+val.project+'</td>';
                val.columns.forEach(val => {
                    let has_dimension = (val.rsr_dimensions.length > 0) ? 'has-dimension' : '';
                    html += "<td class='"+css+" text-right "+has_dimension+"' data-details='"+JSON.stringify(val)+"'>";
                    html += val.total_target_value;
                    html += "</td>";
                    html += "<td class='"+css+" text-right "+has_dimension+"' data-details='"+JSON.stringify(val)+"'>";
                    html += val.total_actual_value;
                    html += "</td>";
                });
                html += '</tr>';
                if (val.childrens.length > 0) {
                    val.childrens.forEach(val => {
                        dtcache.push({'id': val.rsr_project_id, 'columns': val.columns});
                        html += '<tr data-value='+val.rsr_project_id+'>';
                        // html += '<td class="details-control"></td>';
                        html += '<td style="padding-left:40px;">'+val.project+'</td>';
                        val.columns.forEach(val => {
                            let has_dimension = (val.rsr_dimensions.length > 0) ? 'has-dimension' : '';
                            html += "<td class='text-right "+has_dimension+"' data-details='"+JSON.stringify(val)+"'>";
                            html += val.total_target_value;
                            html += "</td>";
                            html += "<td class='text-right "+has_dimension+"' data-details='"+JSON.stringify(val)+"'>";
                            html += val.total_actual_value;
                            html += "</td>";
                        });
                        html += '</tr>';
                    });
                }
            });
        }
    });
    html += '</tbody>';
    localStorage.setItem('dtcache', JSON.stringify(dtcache));
    $("#datatables").append(html);
    return res;
}).then(res => {
    if (res) {
        return datatableOptions("#datatables", res);
    }
    return true;
}).then(table => {
    // plus button click
    $("#datatables tbody").on('click', 'td.details-control', function () {
        let tr = $(this).closest('tr');
        let row = table.row(tr);
        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            (shown !== null) ? shown.hide() : '';
            row.child( formatDetails(tr.data('value')) ).show();
            tr.addClass('shown');
            shown = row.child;
        }
    });

    // value click to show pop up dimension
    $("#datatables tbody").on('click', 'td.has-dimension', function () {
        let details = JSON.parse($(this).attr('data-details'));
        $("#modalTitle").html(details.title);
        let detailTable = '<table class="table table-bordered" id="dimensionDataTable" style="width:100%;" cellspacing="0">';
        detailTable += '<tbody>';
        details.rsr_dimensions.forEach(val => {
            detailTable += '<tr style="background-color:#F2F2F2;">';
            detailTable += '<td class="parent">'+val.name+'</td>';
            detailTable += '<td class="parent text-center">Target</td>';
            detailTable += '<td class="parent text-center">Actual</td>';
            detailTable += '</tr>';
            val.rsr_dimension_values.forEach(val => {
                detailTable += '<tr>';
                detailTable += '<td>'+val.name+'</td>';
                detailTable += '<td class="text-right">'+val.value+'</td>';
                detailTable += '<td class="text-right">'+val.total_actual_value+'</td>';
                detailTable += '</tr>';
            });
        });
        detailTable += '</tbody>';
        detailTable += '</table>';
        $("#modalBody").html(detailTable);
        $("#modal").modal({backdrop: 'static', keyboard: false});
    });
});

const formatDetails = (d) => {
    let dtcache = JSON.parse(localStorage.getItem('dtcache'));
    let data = dtcache.find(x => x.id === d);
    let details = '<div style="margin:15px;">';
    details += '<table class="table table-bordered" style="width:100%;" cellspacing="0">';
    details += '<tbody>';
    data.columns.forEach(val => {
        if (val.rsr_dimensions.length > 0) {
            details += '<tr style="background-color:#E2E3E5;"><td class="parent" colspan="3">'+val.title+'</td></tr>';
            val.rsr_dimensions.forEach(val => {
                details += '<tr style="background-color:#F2F2F2;">';
                details += '<td class="parent">'+val.name+'</td>';
                details += '<td class="parent text-center">Target</td>';
                details += '<td class="parent text-center">Actual</td>';
                details += '</tr>';
                val.rsr_dimension_values.forEach(val => {
                    details += '<tr>';
                    details += '<td>'+val.name+'</td>';
                    details += '<td class="text-right">'+val.value+'</td>';
                    details += '<td class="text-right">'+val.total_actual_value+'</td>';
                    details += '</tr>';
                });
            });
        }
    });
    details += '</tbody>';
    details += '</table>';
    details += '</div>';
    return details;
}

const datatableOptions = (id, res) => {
    let dtoptions = {
        ordering: false,
        dom: 'Birftp',
        buttons: ['colvis'],
        scrollX: true,
        scrollY: '75vh',
        height: 400,
        paging: false,
        fixedHeader: true,
        scrollCollapse: true,
    };
    let hideColumns = {
        columnDefs: [
            { targets: [1,2,3,4,5,6,7], visible: true},
            { targets: '_all', visible: false },
        ],
    };
    dtoptions = res.columns.length > 10
        ? {...dtoptions, ...hideColumns}
        :  dtoptions;
    let table = $(id).DataTable(dtoptions);
    $('#datatables_wrapper').find('label').each(function () {
        $(this).parent().append($(this).children());
    }
    );
    $('#datatables_wrapper .dataTables_filter').find('input').each(function () {
        const $this=$(this);
        $this.attr("placeholder", "Search");
        $this.removeClass('form-control-sm');
    }
    );
    $('#datatables_wrapper .dataTables_length').addClass('d-flex flex-row');
    $('#datatables_wrapper .dataTables_filter').addClass('md-form');
    $('#datatables_wrapper select').removeClass( 'custom-select custom-select-sm form-control form-control-sm');
    $('#datatables_wrapper select').addClass('mdb-select');
    $('#datatables_wrapper .dataTables_filter').find('label').remove();
    return table;
};