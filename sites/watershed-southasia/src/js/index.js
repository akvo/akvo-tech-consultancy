import '../css/app.css';

const $ = require('jquery');
const _ = require('lodash');
const data = require('../json/data.json');
const filters = require('../json/filters.json');
const figures = require('../json/figures.json');
import { initChart, updateChart, getMaps } from './charts.js';
import { newRow } from './util.js';

let newData = {};
let chartFigs = [];
let filterIndex1 = data.names.indexOf('village-habitation_Gram_Panchayat');
let filterIndex2 = data.names.indexOf('village-habitation_Village');

function updateData() {
    let filter = {};
    $('#dr-loc-gram-panchayat').html() != 'Location Gram Panchayat' ? (filter[filterIndex1] = $('#dr-loc-gram-panchayat').html()) : null;
    $('#dr-loc-village').html() != 'Location Village' ? (filter[filterIndex2] = $('#dr-loc-village').html()) : null;
    newData['names'] = data.names;
    newData['values'] = _.filter(data.values, filter);
    _.forEach(chartFigs, (chart) => {
        updateChart(chart, newData);
    });
}

filters['gram_panchayat'].map(x => {
     $( "#loc-gram-panchayat" ).append( '<a class="dropdown-item" href="#">' + x + '</a>' );
});

$('#loc-gram-panchayat a').on('click', function(){
    $('#dr-loc-gram-panchayat').html($(this).html());
    updateData();
});

filters['village'].map(x => {
    $( "#loc-village" ).append( '<a class="dropdown-item" href="#">' + x + '</a>' );
});

$('#loc-village a').on('click', function(){
    $('#dr-loc-village').html($(this).html());
    updateData();
})

$("main").append(newRow('first-row'));
$("main").append(newRow('second-row'));
$("main").append(newRow('third-row'));

_.forEach(figures, (v) => {
    chartFigs.push(initChart(v, data));
});
