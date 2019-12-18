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
    let district = $('#dr-loc-gram-panchayat').html();
    let village = $('#dr-loc-village').html();
    district !== 'Location Gram Panchayat'
        ? (filter[filterIndex1] = district)
        : null;
    village !== 'Location Village'
        ? (filter[filterIndex2] = village)
        : null;
    newData['names'] = data.names;
    newData['values'] = _.filter(data.values, filter);
    _.forEach(chartFigs, (chart) => {
        updateChart(chart, newData, district, village);
    });
}

_.forEach(filters, x => {
     $( "#loc-gram-panchayat" ).append( '<a class="dropdown-item">' + x.location + '</a>' );
    _.forEach(x['villages'], y => {
        $( "#loc-village" ).append( '<a class="dropdown-item">' + y + '</a>' );
    });
});

$('#loc-gram-panchayat a').on('click', function(){
    $('#dr-loc-gram-panchayat').html($(this).html());
    let location = $(this).html();
    $("#loc-village").empty();
    $( "#loc-village" ).append( '<a class="dropdown-item">Location Village</a>' );

    _.forEach(filters, x => {
        if (location == 'Location Gram Panchayat' || location == x.location) {
          _.forEach(x.villages, y => {
              $( "#loc-village" ).append( '<a class="dropdown-item">' + y + '</a>' );
          });
        }
    });
    updateData();
    $('#loc-village a').on('click', function(){
        $('#dr-loc-village').html($(this).html());
        updateData();
    });
    $("#loc-village").children()[0].click();
});

$('#loc-village a').on('click', function(){
    $('#dr-loc-village').html($(this).html());
    updateData();
})

_.forEach(figures, (v) => {
    chartFigs.push(initChart(v, data));
});
