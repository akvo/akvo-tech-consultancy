import {
    Easing,
    TextStyle,
    backgroundColor,
    Color,
    Icons,
    Graphic,
    dataView
} from '../features/animation.js';
import flattenDeep from 'lodash/flattenDeep';
import uniq from 'lodash/uniq';
import sumBy from 'lodash/sumBy';
import intersection from 'lodash/intersection';
import echarts from 'echarts';
const world = require('../features/unep-map.json');

const xxxteritory = world.features
    .filter(x => x.properties.cd === "XXX")
    .map(x => {
        return {
            name: x.properties.name,
            itemStyle: {
                areaColor: {
                    image: document.getElementById("map-pattern"),
                    repeat: 'repeat',
                },
                emphasis: {
                    areaColor : {
                        image: document.getElementById("map-pattern"),
                        repeat: 'repeat',
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                        shadowBlur: 10
                    },
                }
            }
        };
    });

const getData = (data, page, countries, contrib, {
    global,
    datapoints,
    filteredpoints
}, reports = false) => {
    let results = [];
    if (countries.length === 1) {
        return results;
    }
    results = data.map(x => {
        let country = countries.find(c => c.id === x.country_id);
        let values = global ? (x.global + x.total) : x.total;
        let dp = [];
        if (page === "funding") {
            values = 0;
            dp = [];
            x.values.forEach(x => {
                dp = [...dp, ...x.datapoints];
            });
            dp = uniq(dp);
            dp = intersection(dp, filteredpoints);
            dp = datapoints.filter(d => dp.includes(d.datapoint_id));
            if (dp.length > 0) {
                dp = contrib ? dp.map(d => {
                    return { ...d,
                        f: d.f + d.c
                    }
                }) : dp;
                values = sumBy(dp, 'f');
            }
        }
        return {
            name: country.name,
            value: values,
            data: page === "funding" ? { ...x,
                funds: dp
            } : x
        }
    });
    results = results.filter(x => x.value !== 0);
    return results;
}

const Maps = (title, subtitle, props, data, extra) => {
    if (!data) {
        let source = props.data.filters.length > 0 || props.data.countries.length > 0 ?
            props.data.filtered : props.data.master;
        data = getData(
            source,
            props.page.name,
            props.page.countries,
            props.page.fundcontrib,
            props.data
        );
    }
    let values = [];
    let max = 1;
    let min = 0;
    if (data.length > 0) {
        values = data.map(x => x.value);
        if (values.length > 1) {
            min = values.sort((x, y) => x - y)[0];
            max = values.sort((x, y) => y - x)[0];
            min = min === max ? 0 : min;
        }
    };
    let option = {
        title: {
            text: title,
            left: 'center',
            top: '20px',
            subtext: subtitle,
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
        toolbox: {
            show: true,
            orient: "horizontal",
            left: "right",
            top: "top",
            feature: {
                dataView: dataView(props.locale.lang),
                saveAsImage: {
                    type: "jpg",
                    title: props.locale.lang.saveImage,
                    icon: Icons.saveAsImage,
                    backgroundColor: "#ffffff"
                },
                myTool1: {
                    show: true,
                    title: props.locale.lang.zoomIn,
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
                    title: props.locale.lang.zoomOut,
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
                    title: props.locale.lang.resetZoom,
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
            map: 'world',
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
            data: [...data,...xxxteritory],
        }],
        ...backgroundColor,
        ...Easing,
        ...extra,
    };
    return option;
}

export default Maps;
