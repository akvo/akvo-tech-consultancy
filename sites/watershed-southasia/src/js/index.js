import '../css/app.css';

const $ = require('jquery');
const echarts = require('echarts');
const data = require('../json/data.json');
const indicator = require('../json/indicator.json');


let combined = [...data, ...indicator];
console.log(combined);
