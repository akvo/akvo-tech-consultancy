const axios = window.axios;
import {getMaps, getCharts, getCards} from './charts.js';
import {renderRsrTableTemplate, renderRsrTable} from './rsrDatatables.js';
const baseurl = $("meta[name=path]").attr("content");

const info = {
    head: "Header Lorem Ipsum",
    content: "Lorem Ipsum Dolor Sit Amet for Footer"
};

/* Cards Row */
getCards('home/top-three');
getMaps('maps', 'home/map');

/* First Row */
$("main").append("<div class='row' id='first-row'></div>");
getCharts('reachreact/country-total/0/0', 'zero-row', info, "6", "purple");

/* Second Row */
getCharts('home/workstream', 'first-row', info, "7", "blue");
getCharts('home/organisation-forms', 'first-row', info, "5", "morpheus-den");


// Rsr Datatables
renderRsrTableTemplate('datatables');
renderRsrTable(['0', '0'].join('/'), baseurl, 'datatables');