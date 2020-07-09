var toilet_in_schools = echarts.init(document.getElementById('toilet-in-schools'));
var school_toilets = echarts.init(document.getElementById('school-toilets'));

$.get('/api/toilets').done(function(dt) {
    let toilets = [];
    var national = JSON.parse(localStorage.getItem('mean-province'));
    var toilet_province = [];
    national.forEach(function(x){
        var tval= x['toilet_total'];
        var province_name = x['province'];
        var percentage = x[''];
    });
    var t_total = _.sumBy(national, 'toilet_total');
    dt.forEach(createOption);

    function createOption(x, i) {
        var options = {
            dataset: {
                source: x.data
            },
            legend: {
                data: x.data[0],
                align: 'left'
            },
            tooltip: {
                trigger: 'axis',
                position: function(pt) {
                    return [pt[0], '100%'];
                },
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(param) {
                    return "<b>"+param[0]['value'][2]+" ("+param[0]['value'][1]+', '+  param[0]['value'][0].toFixed(2)+"%)</b>";
                }
            },
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
                    color: ['#E15457', '#ffff00', '#3490dc']
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
