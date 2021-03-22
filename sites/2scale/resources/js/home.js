const axios = window.axios;
import { getMaps, getCharts, getCards } from "./charts.js";
import { renderRsrTableTemplate, renderRsrTable } from "./rsrDatatables.js";

/* Static */
const country_id = $("meta[name='country']").attr("content");
const partnership_id = $("meta[name='partnership']").attr("content");
const start_date = $("meta[name='start-date']").attr("content");
const end_date = $("meta[name='end-date']").attr("content");
const endpoints = [country_id, partnership_id, start_date, end_date].join("/");
const baseurl = $("meta[name=path]").attr("content");

const info = {
    head: "Header Lorem Ipsum",
    content: "Lorem Ipsum Dolor Sit Amet for Footer"
};

$("main").append("<div class='row' id='first-row'></div>");
// $("main").append("<hr/><div class='row' id='second-row'></div>");

/* Cards Row */
// getCards('home/top-three');
getMaps("maps", "home/map");

/* UII Row */
// getCharts(
//     "reachreact/food-nutrition-and-security/0/0",
//     "uii-row",
//     info,
//     "4",
//     "blue"
// );
// getCharts(
//     "reachreact/private-sector-development/0/0",
//     "uii-row",
//     info,
//     "4",
//     "blue"
// );
// getCharts("reachreact/input-adittionality/0/0", "uii-row", info, "4", "blue");

/* Zero Row */
getCharts("reachreact/country-total/0/0", "zero-row", info, "6", "purple");

/* First Row */
getCharts("reachreact/gender/" + endpoints, "first-row", info, "12", "blue");

/* Second Row */
// getCharts("home/workstream", "second-row", info, "7", "blue");
// getCharts("home/organisation-forms", "second-row", info, "5", "morpheus-den");

// Rsr Datatables
// renderRsrTableTemplate('datatables');
// renderRsrTable(['0', '0'].join('/'), baseurl, 'datatables');
