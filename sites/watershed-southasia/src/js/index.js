import '../css/app.css';

const $ = require('jquery');
//const data = require('../json/data.json');
const indicator = require('../json/indicator.json');
import { getFilter, getCharts, getMaps } from './charts.js';

/* Filter Row */
$("main").append("<div class='row' id='filter-row'></div>");

getFilter('filter-row');

/* First Row */
$("main").append("<div class='row' id='first-row'></div>");

getMaps(
    '7.3.c. Kanamana - Water point status (availability of water). Data Source: Baseline-Water Point Survey, 2017', 'fig73c', {
        maxZoom: 18,
        lat: -7.837432,
        lng: 110.371239
    },'first-row', { content: "Footer" }, "6");

getCharts(
    '7.1.a. Kanamana - Demographic - Social Category and Economic Category. Data Source: Baseline-Household Survey, 2017', 'fig71a', {
        tooltip: {},
        legend: { data: ['Sales'] },
        xAxis: { data: ["shirt","cardign","chiffon shirt","pants","heels","socks"] },
        yAxis: {},
        series: [{
            name: 'Sales',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
        }]
    },'first-row', { content: "Footer" }, "6");

/* Second Row */
$("main").append("<hr><div class='row' id='second-row'></div>");

getCharts(
    '7.1.d. Kanamana- Demographic - Education level + Social Category. Data Source: Baseline-Household Survey, 2017', 'fig71d', {
        tooltip: {},
        legend: { data: ['Sales'] },
        xAxis: { data: ["shirt","cardign","chiffon shirt","pants","heels","socks"] },
        yAxis: {},
        series: [{
            name: 'Sales',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
        }]
    },'second-row', { content: "Footer" }, "6");

getCharts(
    '7.1.c. Kanamana - Demographic - Female headed households. Data Source: Baseline-Household Survey, 2017',
    'fig71c', {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['Hokya','Hehe','Haha']
        },
        series: [
            {
                name: 'Metal',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:50, name:'Hokya'},
                    {value:30, name:'Hehe'},
                    {value:20, name:'Haha'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    },'second-row', { content: "Footer" }, "6");

/* Third Row */
$("main").append("<hr><div class='row' id='third-row'></div>");

getCharts(
    '7.1.e. Kanamana - Demographic - Occupation. Data Source: Baseline-Household Survey, 2017',
    'fig71e', {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['Hokya','Hehe','Haha']
        },
        series: [
            {
                name: 'Metal',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:50, name:'Hokya'},
                    {value:30, name:'Hehe'},
                    {value:20, name:'Haha'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    },'third-row', { content: "Footer" }, "12");

/* Fourth Row */
$("main").append("<hr><div class='row' id='fourth-row'></div>");

getCharts(
    '7.2.b. Kanamana Water Point Type + Public/Private. Data Source: Baseline-Household Survey, 2017',
    'fig72b', {
        tooltip: {},
        legend: { data: ['Sales'] },
        xAxis: { data: ["shirt","cardign","chiffon shirt","pants","heels","socks"] },
        yAxis: {},
        series: [{
            name: 'Sales',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
        }]
    },'fourth-row', { content: "Footer" }, "6");

getMaps(
    '7.3.a. Kanamana - Access - Individuals dependent on water points. Data Source: Baseline-Water Point Survey, 2017', 'fig73a', {
        maxZoom: 18,
        lat: -7.837432,
        lng: 110.371239
    },'fourth-row', { content: "Footer" }, "6");

/* Fifth Row */
$("main").append("<hr><div class='row' id='fifth-row'></div>");

getMaps(
    '7.3.e. Kanamana - Water point quantity (12L per minute). Data Source: Baseline-Water Point Survey, 2017',
    'fig73e', {
        maxZoom: 18,
        lat: -7.837432,
        lng: 110.371239
    },'fifth-row', { content: "Footer" }, "6");

getMaps(
    '7.3.g. Kanamana - Water Point Reliability (Not operational for +3 days in 6 months). Data Source: Baseline-Water Point Survey, 2017', 'fig73g', {
        maxZoom: 18,
        lat: -7.837432,
        lng: 110.371239
    },'fifth-row', { content: "Footer" }, "6");