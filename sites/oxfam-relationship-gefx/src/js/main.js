import 'bootstrap';
import 'echarts'
const bootstrap = require('./../css/bootstrap.min.css').toString();
const themes = require('./../css/main.css').toString();

var echarts = require('echarts');
var $ = require('jquery');

var myChart = echarts.init(document.getElementById('mychart'));
$.getJSON('output-table.json', function(json) {
        myChart.setOption({
            title: {
                text: 'Oxfam Goals',
                subtext: 'Data Source: Akvo Flow',
                left: 'center',
                top: 'top',
                textStyle: {
                    color: '#000'
                }
            },
            animationDurationUpdate: 1500,
            animationEasingUpdate: 'quinticInOut',
            series: [{
                type: 'graph',
                layout: 'circular',
                // progressiveThreshold: 700,
                data: json.nodes.map(function(node) {
                    return {
                        x: node.x,
                        y: node.y,
                        id: node.id,
                        name: node.label,
                        symbolSize: node.size,
                        itemStyle: {
                            normal: {
                                color: node.color
                            }
                        }
                    };
                }),
                edges: json.edges.map(function(edge) {
                    return {
                        source: edge.sourceID,
                        target: edge.targetID
                    };
                }),
                label: {
                    emphasis: {
                        position: 'right',
                        show: true
                    }
                },
                roam: true,
                focusNodeAdjacency: true,
                lineStyle: {
                    normal: {
                        width: 1,
                        curveness: .4,
                        opacity:.4
                    }
                }
            }]
        }, true);
});
