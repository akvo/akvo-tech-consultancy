import { staticText, gradient, titleCase} from './util.js';
const selectorbar = ($(".selector-bar").length === 1 ? 60 : 0);
const navbar = $("nav.nav").length === 1 ? 56 : 3;
const iframeheight = window.innerHeight - (navbar + selectorbar);
const axios = require("axios");

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
        const start_date = start.format('YYYY-MM-DD');
        const end_date = start.format('YYYY-MM-DD');
        console.log(start_date, end_date);
    });
});

/* DataTables API */

$(".btn.dropdown-toggle.btn-light").removeClass("btn-light");
$(".btn.dropdown-toggle.btn-light").addClass("btn-primary");

$("#btn-data-inspect").click(() => {
    const form_select = $("#select-database-survey").val();
	console.log(form_select);
    let url = window.location.origin + '/frame-database/' + form_select;

    const country_select = $("#select-country-survey").val();
    if (country_select) {
        url += '/' + country_select;
    }
	if (form_select === "") {
		$('#notable').modal('show')
	}
	if (form_select !== "") {
    	$("#data-frame").attr("src", url);
	}
})

/* Partnership API */

const changePartnershipCode = (data) => {
    $("#partnership-code option").remove();
    let html = `<option data-tokens="all" value="0" data-id="0">Select Partnership</options>`;
    data.forEach((d, i) => {
        html += `<option data-tokens="` + d.name +
                `" data-id="` + d.id +
                `" value="` + d.id + `">` +
                titleCase(d.name) + `</option>`;
    });
    html += `<option data-tokens="all" value="0" data-id="0">All Partnerships</options>`;
    $("#partnership-code").append(html);
    $("#partnership-code").selectpicker("refresh");
};

$("#generate-partnership-page").on('click', () => {
    let params = [];
    $(".selectpicker").each((d, i) => {
        let value = $(i).val();
        if (value === undefined || value === "") {
            value = 0;
        }
        params = [...params, value];
    });
    params = params.join("/");
    $("#data-frame").attr("src", "/frame-partnership/" + params);
});

$("#partnership-country").on('change', (data) =>{
    if (data.target.value !== "") {
        axios.get("/api/partnership/" + data.target.value)
            .then(res => {
                changePartnershipCode(res.data);
            });
        return;
    }
    $("#partnership-code option").remove();
    $("#partnership-code").selectpicker("refresh");
    return;
});
