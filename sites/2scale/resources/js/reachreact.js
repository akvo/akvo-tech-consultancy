const axios = window.axios;
import {getCharts} from './charts.js';

/* Static */
const info = {
    head: "Header Lorem Ipsum",
    content: "Lorem Ipsum Dolor Sit Amet for Footer"
};

/* First Row */
$("main").append("<div class='row' id='first-row'></div>");
getCharts('reachreact/gender', 'first-row', info, "12");

/* Second Row */
$("main").append("<hr><div class='row' id='second-row'></div>");
getCharts('reachreact/gender-total', 'second-row', info, "6");
getCharts('reachreact/country-total', 'second-row', info, "6");

