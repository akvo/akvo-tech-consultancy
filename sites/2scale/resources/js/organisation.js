import {
    CountUp
} from 'countup.js';
const echarts = require('echarts');
const axios = require('axios');
const gradients = ["purple", "peach", "blue", "morpheus-den"];

const iframeheight = window.innerHeight - 56;
$("#hierarchy").attr("height", iframeheight);

const titleCase = (str) => {
    str = str.toLowerCase().split('-');
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
}

axios.get('api/charts/organisation/hierarchy')
    .then(res => {
        const element = document.getElementById('hierarchy');
        const myChart = echarts.init(element);
        echarts.util.each(res.data.children, function(datum, index) {
            index % 2 === 0 && (datum.collapsed = true);
        });
        const option = {
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove'
            },
            series: [{
                room: 'zoom',
                zoom: true,
                type: 'tree',

                data: [res.data],
                initialTreeDepth: 1,
                top: '1%',
                left: '7%',
                bottom: '1%',
                right: '20%',
                symbolSize: 8,
                itemStyle: {
                    borderWidth:0,
                },
                lineStyle: {
                    curveness: .3,
                },
                symbolSize: function(params, name) {
                    if (name.data.value === "organisation") {
                        return 5;
                    };
                    if (name.data.value === "projects") {
                        return 7;
                    };
                    if (name.data.value === "partnership") {
                        return 10;
                    };
                    if (name.data.value === "countries") {
                        return 15;
                    };
                    return 30;
                },
                symbol: function(params, name) {
                    if (name.data.value === "organisation") {
                        return 'rect';
                    };
                    if (name.data.value === "projects") {
                        return 'circle';
                    };
                    if (name.data.value === "partnership") {
                        return 'triangle';
                    };
                    if (name.data.value === "countries") {
                        return 'roundRect';
                    };
                    return 'diamond';
                },
                emphasis: {
                    label: {
                        backgroundColor: '#000',
                        color: '#fff',
                        padding: 5,
                    },
                    lineStyle: {
                        width: 2,
                    },
                    itemStyle: {
                        color: '#ff1744'
                    }
                },
                label: {
                    normal: {
                        position: 'left',
                        verticalAlign: 'middle',
                        align: 'right',
                        fontSize: 12,
                        fontFamily: 'Roboto'
                    }
                },
                leaves: {
                    label: {
                        normal: {
                            position: 'right',
                            verticalAlign: 'middle',
                            align: 'left'
                        }
                    }
                },
                expandAndCollapse: true,
                animationDuration: 250,
                animationEasing: 'backOut',
                animationDurationUpdate: 250
            }]
        }
        myChart.setOption(option);
    });
