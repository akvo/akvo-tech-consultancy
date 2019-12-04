const axios = require('axios');
import {getMaps, getCharts, getCards} from './charts.js';

const info = {
    head: "Header Lorem Ipsum",
    content: "Lorem Ipsum Dolor Sit Amet for Footer"
};

/* Cards Row */
getCards('top-three');
getMaps();

/* First Row */
$("main").append("<div class='row' id='first-row'></div>");
getCharts('reachreact/country-total', 'zero-row', info, "6", "purple");

/* Second Row */
getCharts('home/workstream', 'first-row', info, "7", "blue");
getCharts('home/organisation-forms', 'first-row', info, "5", "morpheus-den");
