const axios = window.axios;
import {getCharts, getCards} from './charts.js';

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

// $("main").append("<div class='row' id='third-row'></div>");
// getCharts('reachreact/gender/' + endpoints, 'third-row', info, "12");

// $("main").append("<div class='row' id='third-row'></div>");
// getCharts('test/'+ endpoints, 'third-row', info, "12");