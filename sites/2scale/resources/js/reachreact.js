const axios = window.axios;
import {getCharts, getCards} from './charts.js';

/* Static */
const country_id = $("meta[name='country']").attr("content");
const partnership_id = $("meta[name='partnership']").attr("content");
const endpoints = [country_id, partnership_id].join('/');

/* Static */
const info = {
    head: "Header Lorem Ipsum",
    content: "Lorem Ipsum Dolor Sit Amet for Footer"
};

getCards('reachreact/gender-count/' + endpoints);

/* First Row */
$("main").append("<div class='row' id='first-row'></div>");
getCharts('reachreact/gender/' + endpoints, 'first-row', info, "12");

/* Second Row */
$("main").append("<hr><div class='row' id='second-row'></div>");
getCharts('reachreact/gender-total/' + endpoints, 'second-row', info, "6");
getCharts('reachreact/country-total/' + endpoints, 'second-row', info, "6");
