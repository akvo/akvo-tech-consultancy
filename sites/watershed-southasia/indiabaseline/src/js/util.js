const $ = require('jquery');
const data = require('../json/data.json');

export const defaultColors = ["#2f4554", "#c23531", "#749f83", "#d48265"];
export const admLevel = {
    district : data.names.indexOf("village-habitation_Gram_Panchayat"),
    village : data.names.indexOf("village-habitation_Village")
}

export const titleCase = (str) => {
    str = str.toLowerCase().split('-');
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
}

export const insert = (str, index, value) => {
    return str.substr(0, index) + value + str.substr(index);
}

export const newContainer = (pos) => {
    const container = $('#' + pos).length === 1 ? true : false;
    if (!container) {
        $("main").append(`<hr/><div class="row" id="` + pos + `"></div>`);
    }
}
