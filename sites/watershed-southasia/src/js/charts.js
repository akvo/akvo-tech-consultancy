import {
    insert,
    titleCase
} from './util.js';
import {
    newContainer
} from './util.js';
const echarts = require('echarts');
const L = require('leaflet');
const _ = require('lodash');

export const initChart = (figure, data) => {
    newContainer(figure.position);
    let id = figure['title'].split(" ")[0].replace(/\./g, '');
    let html = `<div class="col-md-` + figure['width'] + `">
              <div class="card">
                <div class="card-header gradient-card-header">` + titleCase(figure['title']) + `</div>
                <div class="card-body">
                    <div class="loading-frame" id="loading-` + id + `" >
                    <div class="spinner-border text-primary">
                    </div>
                    </div>
                  <div id="` + id + `" style="height:450px"></div>
                </div>
                <div class="card-footer text-muted">` + figure['content'] + `</div>
              </div>
              </div>`;
    $("#" + figure['position']).append(html);
    var element = document.getElementById(id);
    var myChart = echarts.init(element);
    myChart['figure'] = figure;

    if (figure['type'] == 'bar') {
        let indexLegend = data.names.indexOf(figure['legend']);
        let indexX = data.names.indexOf(figure['x']);
        let legend = _(data.values).map(x => x[indexLegend]).uniq().value();
        let xAxis = _(data.values).map(x => x[indexX]).uniq().value();
        let sums = _(data.values).countBy(indexX).value();

        let series = _(data.values).groupBy(indexLegend).map((items, val) => {
            let values = _(items).countBy(indexX).value();
            let dataSeries = _(xAxis).map(x => {
                let defVal = values[x] == undefined ? null : values[x];
                if (defVal === null || defVal === 0) {
                    return null;
                }
                return ((defVal * 100) / sums[x]).toFixed(0);
            }).value();

            return {
                name: val,
                type: 'bar',
                stack: "total",
                zLevel: 3,
                label: {
                    normal: {
                        fontSize: 14,
                        show: true,
                        position: "inside",
                        formatter: "{c}%"
                    }
                },
                data: dataSeries
            }
        }).value();

        myChart.setOption({
            tooltip: {},
            legend: {
                data: legend
            },
            xAxis: {
                data: _.map(xAxis, x => insert(x, 10, "\n")),
                axisLabel: {
                    rotate: 305
                }
            },
            yAxis: {},
            series
        });
        $("#loading-" + id).remove();
        return myChart;
    }

    if (figure['type'] == 'pie') {
        let indexLegend = data.names.indexOf(figure['legend']);
        let legend = _(data.values).map(x => x[indexLegend]).uniq().value();
        let chartData = _(data.values).countBy(indexLegend).value();
        let series = _(legend).map(x => {
            return {
                value: chartData[x],
                name: x
            };
        }).value();

        myChart.setOption({
            tooltip: {},
            legend: {
                data: legend
            },
            series: {
                type: 'pie',
                radius: ['70%', '30%'],
                center: ['50%', '50%'],
                zLevel: 3,
                label: {
                    normal: {
                        fontSize: 14,
                        show: true,
                        position: "inside",
                        formatter: "{d}%\n({c})"
                    }
                },
                data: series
            }
        });
        $("#loading-" + id).remove();
        return myChart;
    }
}

export const updateChart = (chart, data) => {
    let figure = chart['figure'];
    let indexLegend = data.names.indexOf(figure['legend']);
    let indexX = data.names.indexOf(figure['x']);
    let legend = _(data.values).map(x => x[indexLegend]).uniq().value();
    let xAxis = _(data.values).map(x => x[indexX]).uniq().value();
    let sums = _(data.values).countBy(indexX).value();

    let series = _(data.values).groupBy(indexLegend).map((items, val) => {
        let values = _(items).countBy(indexX).value();
        let dataSeries = _(xAxis).map(x => {
            let defVal = values[x] == undefined ? null : values[x];
            if (defVal === null || defVal === 0) {
                return null;
            }
            return Math.round((defVal * 100) / sums[x]);
        }).value();

        return {
            name: val,
            type: 'bar',
            stack: "total",
            zLevel: 3,
            label: {
                normal: {
                    fontSize: 14,
                    show: true,
                    position: "inside",
                    formatter: "{c}%"
                }
            },
            data: dataSeries
        }
    }).value();

    chart.setOption({
        tooltip: {},
        legend: {
            data: legend
        },
        xAxis: {
            data: _.map(xAxis, x => insert(x, 10, "\n")),
            axisLabel: {
                rotate: 305
            }
        },
        yAxis: {},
        series
    });
}
