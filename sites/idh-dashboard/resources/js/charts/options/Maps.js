import {
    Color,
    Icons,
    Easing,
    Legend,
    TextStyle,
    backgroundColor,
    splitTitle,
    dataZoom,
} from '../chart-options.js';
import echarts from 'echarts';
import maxBy from 'lodash/maxBy';
import minBy from 'lodash/minBy';

const Maps = (title, data) => {
    const world = require('../'+data.maps+'.js');
    let records = data.records;
    return {
        title: {
            text: splitTitle(title),
            right: 'center',
            top: '10px',
            ...TextStyle
        },
        tooltip: {
            trigger: 'item',
            showDelay: 0,
            transitionDuration: 0.2,
            formatter: function(params) {
                if (params.value) {
                    var value = (params.value + '').split('.');
                    value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
                    return params.seriesName + '<br/>' + params.name + ': ' + value;
                }
                return 'No Data';
            },
            backgroundColor: "#ffffff",
            ...TextStyle
        },
        visualMap: {
            bottom: '10px',
            left: 'center',
            orient: 'horizontal',
            itemHeight: 'auto',
            itemWidth: 10,
            min: records.length > 1 ? minBy(records, 'value').value : 0,
            max: records.length > 1 ? maxBy(records, 'value').value : records[0]['value'],
            text: ['Max', 'Min'],
            realtime: false,
            calculable: true,
            inRange: {
                color: ["#ffc107",Color.color[0]]
            }
        },
        toolbox: {
            orient: "horizontal",
            left: "right",
            top: "10px",
            feature: {
                saveAsImage: {
                    type: "jpg",
                    title: "Save Image",
                    icon: Icons.saveAsImage,
                    backgroundColor: "#ffffff"
                },
                myTool1: {
                    show: true,
                    title: "zoom in",
                    icon: Icons.zoomIn,
                    onclick: function(params, charts) {
                        let new_zoom = params.option.series[0].zoom + 1;
                        if (new_zoom > 4) {
                            new_zoom = 4;
                        }
                        let new_series = {
                            ...params.option.series[0],
                            zoom: new_zoom
                        };
                        let options = charts.getOption();
                        options = {
                            ...options,
                            series: [new_series]
                        }
                        let id = charts.getDom();
                        const thecharts = echarts.init(id);
                        thecharts.setOption(options);
                        return;
                    },
                },
                myTool2: {
                    show: true,
                    title: "zoom out",
                    icon: Icons.zoomOut,
                    onclick: function(params, charts) {
                        let new_zoom = params.option.series[0].zoom - 1;
                        if (new_zoom < 0) {
                            new_zoom = 0;
                        }
                        let new_series = {
                            ...params.option.series[0],
                            zoom: new_zoom
                        };
                        let options = charts.getOption();
                        options = {
                            ...options,
                            series: [new_series]
                        }
                        let id = charts.getDom();
                        const thecharts = echarts.init(id);
                        thecharts.setOption(options);
                        return;
                    },
                },
                myTool3: {
                    show: true,
                    title: "reset zoom",
                    icon: Icons.reset,
                    onclick: function(params, charts) {
                        let new_series = {
                            ...params.option.series[0],
                            zoom: 0
                        };
                        let options = charts.getOption();
                        options = {
                            ...options,
                            series: [new_series]
                        }
                        let id = charts.getDom();
                        const thecharts = echarts.init(id);
                        thecharts.setOption(options);
                        return;
                    },
                }
            },
            backgroundColor: "#FFF",
        },
        series: [{
            name: title,
            type: 'map',
            roam: 'move',
            map: data.maps,
            aspectScale: 1,
            emphasis: {
                label: {
                    show: false,
                }
            },
            zoom: 1,
            itemStyle: {
                areaColor: '#f1f1f5',
                emphasis: {
                    areaColor: "#ffc107",
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 10
                }
            },
            data: records,
        }],
        ...Color,
        ...Easing,
        ...backgroundColor
    }
}

export default Maps;
