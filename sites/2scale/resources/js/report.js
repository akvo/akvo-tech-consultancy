const axios = window.axios;
import {getMaps, getCharts, getCards} from './charts.js';
import {renderRsrTableTemplate, renderRsrTable} from './rsrDatatables.js';

const baseurl = $("meta[name=path]").attr("content");
const info = {
    head: "Header Lorem Ipsum",
    content: "Lorem Ipsum Dolor Sit Amet for Footer"
};


$("main").append("<div class='row' id='first-row'></div>");
/* First Row */
getCharts('report/total-activities', 'first-row', info, "12", "blue");

// Rsr Datatables
renderRsrTableTemplate('datatables', '75%');
// renderRsrTableTemplate('datatables', '20%');
renderRsrTable(['0', '0'].join('/'), baseurl, 'datatables');