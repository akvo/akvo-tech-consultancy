const iframeheight = window.innerHeight - 158;

$("#akvo-flow-web").attr("height", iframeheight);
$("#data-frame").attr("height", iframeheight);

/* Akvo Flow Web API */

$("#select-survey").on("change.bs.select", (e) => {
    let url = e.target.attributes["data-url"].value + "/" + e.target.value;
    $("#akvo-flow-web").attr("src", url);
});

const startdate = moment().subtract(29, 'days');
const enddate = moment();

$(function() {
    $('input[name="daterange"]').daterangepicker({
        startDate: startdate,
        endDate: enddate,
        opens: 'center',
        ranges: {
           'Today': [moment(), moment()],
           'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
           'This Month': [moment().startOf('month'), moment().endOf('month')],
           'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, function(start, end, label) {
        console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
    });
});

/* DataTables API */

$("#btn-data-inspect").click(() => {
    const form_select = $("#select-database-survey").val();
    let url = window.location.origin + '/frame-datatable/' + form_select;

    const country_select = $("#select-country-survey").val();
    if (country_select) {
        url += '/' + country_select;
    }
    $("#data-frame").attr("src", url);
})
