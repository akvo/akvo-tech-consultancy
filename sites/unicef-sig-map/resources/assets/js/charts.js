const echarts = require('echarts');

var toilet_in_schools = echarts.init(document.getElementById('toilet-in-schools'));
var school_toilets = echarts.init(document.getElementById('school-toilets'));

$.get('/api/toilets').done(function(dt) {
    let toilets = [];
    dt.forEach(createOption);

    function createOption(x, i) {
        console.log(x);
        var options = {
            dataset: {
                source: x.data
            },
            legend: {
                data: x.data[0],
                align: 'left'
            },
            tooltip: {},
            grid: {
                containLabel: true
            },
            visualMap: {
                orient: 'horizontal',
                left: 'center',
                min: 10,
                max: 100,
                text: ['100%', '0%'],
                dimension: 0,
                inRange: {
                    color: ['#E15457','#ffff00','#3490dc']
                }
            },
            xAxis: {
                name: 'total'
            },
            yAxis: {
                type: 'category'
            },
            series: [{
                type: 'bar',
                encode: {
                    x: 'total',
                    y: 'name'
                }
            }],
            animationEasing: 'elasticOut',
            animationDelayUpdate: function(idx) {
                return idx * 5;
            }
        };
        toilets.push(options);
    };
    toilet_in_schools.setOption(toilets[0]);
    school_toilets.setOption(toilets[1]);
});
