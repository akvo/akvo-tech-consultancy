import { staticText, gradient, titleCase} from './util.js';
import Dexie from 'dexie';
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

const startdate = moment().subtract(2, 'year').startOf('month');
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
           'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
           'All Data': [moment().subtract(2, 'years').startOf('month'), moment()]
        }
    }, function(start, end, label) {
        const start_date = start.format('YYYY-MM-DD');
        const end_date = start.format('YYYY-MM-DD');
    });
});

/* DataTables API */

$(".btn.dropdown-toggle.btn-light").removeClass("btn-light");
$(".btn.dropdown-toggle.btn-light").addClass("btn-primary");

$("#btn-data-inspect").click(() => {
    const form_select = $("#select-database-survey").val();
    let url = window.location.origin + '/frame/database/' + form_select;

    let date = $('input[name="daterange"]')[0].value.split(' - ');
    date = date.map((x) => {
        return moment(x).format('YYYY-MM-DD');
    });

    const country_select = $("#select-country-survey").val();
    if (country_select) {
        url += '/' + country_select;
    }
	if (form_select === "") {
		$('#notable').modal('show')
	}
	if (form_select !== "") {
    	$("#data-frame").attr("src", url + '/' + date[0] + '/' + date[1]);
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

    let date = $('input[name="daterange"]')[0].value.split(' - ');
    date = date.map((x) => {
        params = [...params, moment(x).format('YYYY-MM-DD')];
        return moment(x).format('YYYY-MM-DD');
    });
    params = params.join("/");
    $("#data-frame").attr("src", "/frame/partnership/" + params);
});

$("#generate-reachreact-page").on('click', () => {
    let params = [];
    $(".selectpicker").each((d, i) => {
        let value = $(i).val();
        if (value === undefined || value === "") {
            value = 0;
        }
        params = [...params, value];
    });

    let date = $('input[name="daterange"]')[0].value.split(' - ');
    date = date.map((x) => {
        params = [...params, moment(x).format('YYYY-MM-DD')];
        return moment(x).format('YYYY-MM-DD');
    });
    params = params.join("/");
    $("#data-frame").attr("src", "/frame/reachreact/" + params);
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

const authMessage = () => {
    let authModal = $("#authError").attr('data');
    if (authModal === 'not_authorized') {
        $("#myModalAuthTitle").text("Not Authorized");
        $("#myModalAuth").modal('toggle');
        $("#myModalAuthBody").text("You're not authorized, please contact your organization to request an access!");
    }

    if (authModal === 'email') {
        $("#myModalAuthTitle").text("Please verify your email");
        $("#myModalAuth").modal('toggle');
        $("#myModalAuthBody").text("An email verification has been sent to your email, please verify your email first!");
    }
};

const revalidate = () => {
    const now = moment();
    let cachetime = localStorage.getItem('cache-time');
    cachetime = cachetime !== null ? moment(cachetime) : moment().subtract(1, 'days');
    if (now > cachetime) {
        let tomorrow = moment().add(1, 'days').format("YYYY-MM-DD");
        localStorage.setItem('cache-time', tomorrow);
        Dexie.delete('2scale');
    }
    if (now < cachetime) {
        console.info("USING CACHED");
    }
}

revalidate();
authMessage();

$(".form-list").css('display', 'none');
$(".dropdown-menu.inner.show").css('display', 'none');

$("#survey-parent").on('change', (data) => {
    $(".form-list").hide(() => {
        if (data.target.value !== "select-init") {
            let el = ".form-list." + data.target.value;
            $(el).show("fast");
        }
    });
    $(".filter-option-inner-inner").text('Select Questionnare');
    return;
});
