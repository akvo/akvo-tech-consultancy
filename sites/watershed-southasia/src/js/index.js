import '../css/app.css';

const $ = require('jquery');
//const data = require('../json/data.json');
const filters = require('../json/filters.json');
import { getFilter, getCharts, getMaps } from './charts.js';

filters['gram_panchayat'].map(x => {
     $( "#loc-gram-panchayat" ).append( '<a class="dropdown-item" href="#">' + x + '</a>' ); 
});

$('#loc-gram-panchayat a').on('click', function(){    
    $('#dr-loc-gram-panchayat').html($(this).html());    
});

filters['village'].map(x => {
    $( "#loc-village" ).append( '<a class="dropdown-item" href="#">' + x + '</a>' ); 
});

$('#loc-village a').on('click', function(){    
    $('#dr-loc-village').html($(this).html());    
})

/* First Row */
$("main").append("<div class='row' id='first-row'></div>");

getMaps(
    '7.3.c. Kanamana - Water point status (availability of water). Data Source: Baseline-Water Point Survey, 2017',
    'first-row',
    { type: "map", content: "Footer" }, "6");

getCharts(
    '7.1.a. Kanamana - Demographic - Social Category and Economic Category. Data Source: Baseline-Household Survey, 2017',
    'first-row', { type: "bar", content: "Footer" }, "6");

/* Second Row */
$("main").append("<hr><div class='row' id='second-row'></div>");

getCharts(
    '7.1.d. Kanamana- Demographic - Education level + Social Category. Data Source: Baseline-Household Survey, 2017',
    'second-row', { type: "bar", content: "Footer" }, "6");

getCharts(
    '7.1.c. Kanamana - Demographic - Female headed households. Data Source: Baseline-Household Survey, 2017',
    'second-row', { type: "pie", content: "Footer" }, "6");

/* Third Row */
$("main").append("<hr><div class='row' id='third-row'></div>");

getCharts(
    '7.1.e. Kanamana - Demographic - Occupation. Data Source: Baseline-Household Survey, 2017',
    'third-row', { type: "pie", content: "Footer" }, "12");

/* Fourth Row */
$("main").append("<hr><div class='row' id='fourth-row'></div>");

getCharts(
    '7.2.b. Kanamana Water Point Type + Public/Private. Data Source: Baseline-Household Survey, 2017',
    'fourth-row', { type: "bar", content: "Footer" }, "6");

getMaps(
    '7.3.a. Kanamana - Access - Individuals dependent on water points. Data Source: Baseline-Water Point Survey, 2017',
    'fourth-row', { type: "map", content: "Footer" }, "6");

/* Fifth Row */
$("main").append("<hr><div class='row' id='fifth-row'></div>");

getMaps(
    '7.3.e. Kanamana - Water point quantity (12L per minute). Data Source: Baseline-Water Point Survey, 2017',
    'fifth-row', { type: "map", content: "Footer" }, "6");

getMaps(
    '7.3.g. Kanamana - Water Point Reliability (Not operational for +3 days in 6 months). Data Source: Baseline-Water Point Survey, 2017',
    'fifth-row', { type: "map", content: "Footer" }, "6");

/* Six Row 
$("main").append("<hr><div class='row' id='six-row'></div>");

getMaps(
    '7.3.i. Kanamana - Water Quality Map. Data Source: Baseline-Water Point Survey, 2017',
    'six-row', { type: "map", content: "Footer" }, "6");

getMaps(
    '7.3.k. Kanamana - Water point quality - pH. Data Source: Baseline-Water Point Survey, 2017',
    'six-row', { type: "bar", content: "Footer" }, "6");
*/
/* Seven Row 
$("main").append("<hr><div class='row' id='seven-row'></div>");

getMaps(
    '7.3.m. Kanamana - Water point quality - EC. Data Source: Baseline-Water Point Survey, 2017',
    'seven-row', { type: "bar", content: "Footer" }, "6");

getMaps(
    '7.3.0. Kanamana - Water point quality - Coliform. Data Source: Baseline-Water Point Survey, 2017',
    'seven-row', { type: "bar", content: "Footer" }, "6");
*/
/* Eight Row 
$("main").append("<hr><div class='row' id='eight-row'></div>");

getMaps(
    '7.3.q. Kanamana- Water point quality - Total Iron. Data Source: Baseline-Water Point Survey, 2017',
    'eight-row', { type: "bar", content: "Footer" }, "6");

getMaps(
    '7.3.s. Kanamana - Repair done in the last one year. Data Source: Baseline-Water Point Survey, 2017',
    'eight-row', { type: "bar", content: "Footer" }, "6");
*/