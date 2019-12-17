import '../css/app.css';

const $ = require('jquery');
const _ = require('lodash');
const data = require('../json/data.json');
const filters = require('../json/filters.json');
const figures = require('../json/figures.json');
import { initChart, updateChart, getMaps } from './charts.js';

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

_.forEach(filters, x => {
     $( "#loc-gram-panchayat" ).append( '<a class="dropdown-item" href="#">' + x['location'] + '</a>' );
    _.forEach(x['villages'], y => {
        $( "#loc-village" ).append( '<a class="dropdown-item" href="#">' + y + '</a>' );
    });
});

$('#loc-gram-panchayat a').on('click', function(){
    $('#dr-loc-gram-panchayat').html($(this).html());
    updateData();
});

$('#loc-village a').on('click', function(){
    $('#dr-loc-village').html($(this).html());
    updateData();
})

_.forEach(figures, (v) => {
    chartFigs.push(initChart(v, data));
});
