import {
    CountUp
} from 'countup.js';
const echarts = window.echarts;
const axios = require('axios');
const gradients = ["purple", "peach", "blue", "morpheus-den"];
import {getHierarchy} from './charts.js';

const iframeheight = window.innerHeight - 56;
$("#hierarchy").attr("height", iframeheight);



const titleCase = (str) => {
    str = str.toLowerCase().split('-');
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
}

axios.get('/charts/organisation/hierarchy')
    .then(res => {
        const data = res.data;
        getHierarchy(data);
        $('#select-country-survey').on('change', (e) => {
            let filtered = data.children.filter(x => x.name.toLowerCase() === e.target.value.toLowerCase());
            filtered = {
                ...data,
                children: filtered
            };
            if (e.target.value === "") {
                filtered = data;
            }
            getHierarchy(filtered, e.target.value);
        });
    });
