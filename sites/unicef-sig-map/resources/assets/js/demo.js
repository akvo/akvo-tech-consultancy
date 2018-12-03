function demoChartOne() {
    var dom = document.getElementById('demo-chart-1');
    var myChart = echarts.init(dom);
    var app = {};
    // Generate data
    var category = [];
    var dottedBase = +new Date(2018, 1, 1);
    var lineData = [];
    var barData = [];
    var g = 20;
    for (var i = 0; i < 70; i++) {
        var date = new Date(dottedBase += 3600 * 4200 * 1000);
        category.push([
            date.getFullYear()
        ].join('-'));
        var b = Math.random() * 2;
        g = g + b;
        var d = 100;
        barData.push(g.toFixed(2));
        lineData.push(d);
    }
    // option
    chartOption = {
        title: {
            top: 20,
            left: 20,
            textStyle: {
                fontFamily: 'Roboto',
            },
            text: 'National Access to Basic Sanitation',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            top: 40,
            data: ['target', 'Collected Data'],
            textStyle: {
                color: '#343a40'
            }
        },
        xAxis: {
            data: category,
            axisLine: {
                lineStyle: {
                    color: '#343a40'
                }
            }
        },
        yAxis: {
            name: 'Percentage',
            nameLocation: 'middle',
            nameGap: 50,
            splitLine: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#343a40'
                }
            }
        },
        grid: {
            top: 80,
            containLabel: true
        },
        series: [{
            name: 'target',
            type: 'line',
            smooth: true,
            data: lineData
        }, {
            name: 'Collected Data',
            type: 'bar',
            barWidth: 10,
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1, [{
                                offset: 0,
                                color: '#28a745'
                            },
                            {
                                offset: 1,
                                color: '#070'
                            }
                        ]
                    )
                }
            },
            data: barData
        }, {
            name: 'target',
            type: 'bar',
            barGap: '-100%',
            barWidth: 10,
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(20,200,212,0.5)'
                            },
                            {
                                offset: 0.2,
                                color: 'rgba(20,200,212,0.2)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(20,200,212,0)'
                            }
                        ]
                    )
                }
            },
            z: -12,
            data: lineData
        }]
    };

    if (chartOption && typeof chartOption === "object") {
        myChart.setOption(chartOption, true);
    }
}

var newDiv = d3.select('#vizcomps')
    .append('div')
    .attr('class', 'col-md-12 chart-box');
newDiv.append('div').attr('class', 'visualization col-md-12').attr('id', 'demo-chart-1');

// init the data
demoChartOne();
demoChartTwo();

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}
