$('#stack_search').children().remove();

let cacheRem = JSON.parse(localStorage.getItem('all-visualization'));
if (cacheRem !== null) {
    cacheRem.forEach(function(x) {
        localStorage.removeItem(x);
    });
}

var provinceList = [
    "National",
    "Western",
    "Temotu",
    "Rennell and Bellona",
    "Malaita",
    "Makira",
    "Isabel",
    "Honiara",
    "Guadalcanal",
    "Choiseul",
    "Central",
];

localStorage.setItem('x-province', JSON.stringify([]));
localStorage.setItem('all-visualization', JSON.stringify([]));

d3.select('body').append('div').attr('id', 'main-filter-list');
$('#main-filter-list').css('position', 'fixed');

$('#province-filter').css('display', 'inline-block');
d3.select('#main-filter-list').append('div').attr('class', 'legendprovince').text('Province');
d3.select('#main-filter-list').append('div').attr('id', 'province-list');
provinceList.forEach(function(x, i) {
    var provinceId = x.split(' ');
    provinceId = provinceId.join('_');
    d3.select('#province-list')
        .append('a')
        .attr('id', 'province-' + i)
        .text(x)
        .on('click', function(a) {
            var excludeProvince = JSON.parse(localStorage.getItem('x-province'));
            if ($(this).hasClass('inactive')) {
                $(this).removeClass('inactive');
                excludeProvince = excludeProvince.filter(function(v, i, a) {
                    return v != x;
                });
                $('#province-all').text('Disable All');
                $('#province-all').removeClass('enable-all');
            } else {
                $(this).addClass('inactive');
                excludeProvince.push(x);
                $('#province-all').text('Enable All');
                $('#province-all').addClass('enable-all');
            }
            localStorage.setItem('x-province', JSON.stringify(excludeProvince));
            updateCharts();
        });
});
d3.select('#province-list').append('button')
    .attr('class', 'btn')
    .attr('id', 'province-all')
    .attr('data-select', 'remove')
    .text('Disable All')
    .on('click', function(a) {
        var excludeProvince = JSON.parse(localStorage.getItem('x-province'));
        if (excludeProvince.length > 0) {
            excludeProvince = [];
            $('#province-list').children().removeClass('inactive');
            $('#province-all').text('Disable All');
            $('#province-all').removeClass('enable-all');
        } else {
            excludeProvince = provinceList;
            $('#province-list').children().addClass('inactive');
            $('#province-all').text('Enable All');
            $('#province-all').addClass('enable-all');
        }
        localStorage.setItem('x-province', JSON.stringify(excludeProvince));
        updateCharts();
    });
$('.legendprovince').click(function(e) {
    $('#province-list').slideToggle();
    if ($(this).hasClass('active')) {
        $(this).removeClass('active');
    } else {
        $(this).addClass('active');
        if ($('.legendschooltype').hasClass('active')) {
            $('.legendschooltype').click();
        };
    }

});


function createId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

function newChart(data, randomId, colors) {
    var newDiv = d3.select('#vizcomps')
        .append('div')
        .attr('id', randomId)
        .attr('class', 'col-md-6 chart-box');
    newDiv.append('div').attr('class', 'visualization').attr('id', 'selector-' + randomId);
    var dom = document.getElementById('selector-' + randomId);
    var myChart = echarts.init(dom);
    var app = {};
    var chartOption = vizOptions(data.answer, data.province, data.result, colors);
    if (chartOption && typeof chartOption === "object") {
        myChart.setOption(chartOption, true);
        $('#selector-' + randomId).prepend('<div class="card-header">' + toTitleCase(data.question) + '</div>');
        var allCharts = JSON.parse(localStorage.getItem('all-visualization'));
        allCharts.push(myChart.id);
        localStorage.setItem('all-visualization', JSON.stringify(allCharts));
        localStorage.setItem(myChart.id, JSON.stringify(data.result));
    }
}

function generateCharts(data) {
    // Water
    newChart(data['Y'], createId(), ['#dc3545', '#28a745']);
    newChart(data['EY'], createId(), ['#40B1e6', '#fff176', '#ffCA28']);
    newChart(data['EZ'], createId(), ['#4fc3f7', '#fff176', '#ffb300']);
    newChart(data['AN'], createId(), ['#dc3545', '#28a745']);
    // Sanitation
    newChart(data['AV'], createId(), ['#dc3545', '#28a745']);
    newChart(data['FB'], createId(), ['#67b769', '#fff176', '#ffb300']);
    newChart(data['FC'], createId(), ['#4fc3f7', '#fff176', '#ffb300']);
    newChart(data['FD'], createId(), ['#4fc3f7', '#fff176', '#ffb300']);
    // Hygiene
    newChart(data['CF'], createId(), ['#dc3545', '#28a745']);
    newChart(data['CL'], createId(), ['#4fc3f7', '#fff176', '#ffb300']);
    newChart(data['CR'], createId(), ['#dc3545', '#28a745']);
    newChart(data['FE'], createId(), ['#AB47BC', '#fff176', '#ffb300']);
}

var rwchart = JSON.parse(localStorage.getItem('raw-chart-data'));
if (rwchart === null) {
    d3.json('/api/getcountable', function(error, data) {
        generateCharts(data);
        localStorage.setItem('raw-chart-data', JSON.stringify(data));
    });
} else {
    generateCharts(rwchart);
}


function updateCharts() {
    var allCharts = JSON.parse(localStorage.getItem('all-visualization'));
    var xProvinces = JSON.parse(localStorage.getItem('x-province'));
    let activeList = [];
    _.forEach(xProvinces, function(x) {
        let idx = _.findIndex(provinceList, function(o) {
            return o.includes(x);
        });
        activeList.push(idx);
    });
    let newProvinces = _.reject(provinceList, function(x) {
        return xProvinces.includes(x);
    });
    allCharts.forEach(function(x) {
        let thisCharts = echarts.getInstanceById(x);
        let a = thisCharts.getOption();
        let colors = a.color;
        let yAxis = JSON.parse(localStorage.getItem(x));
        let answer = a.legend[0].data;
        let newAxis = _.map(yAxis, function(y) {
            let x = y;
            x.data = _.reject(x.data, function(v, i) {
                return activeList.includes(i);
            });
            return x;
        });
        let chartOption = vizOptions(answer, newProvinces, newAxis, colors);
        if (chartOption && typeof chartOption === "object") {
            thisCharts.setOption(chartOption, true);
        }
    });
}

function vizOptions(answer, province, result, colors) {
    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: answer,
            left: '20',
            top: '20',
        },
        grid: {
            left: '3%',
            right: '5%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value'
        },
        yAxis: {
            type: 'category',
            data: province
        },
        color: colors,
        series: result
    };
}
