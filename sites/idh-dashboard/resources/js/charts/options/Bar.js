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
import sum from 'lodash/sum';
import sortBy from 'lodash/sortBy';

export const Bar = (title, data, horizontal=false) => {
    data = sortBy(data, 'value');
    let axisLabels = data.map(x => x.name);
    let values = data.map(x => x.value);
    let avg = 0;
    if (values.length > 0) {
        avg = sum(values) / values.length;
        avg = avg < 100 ? true : false;
    }
    let horizontalxAxis = {
            data: axisLabels,
            axisLabel: {
                show: true
            },
            axisTick: {
                show: true
            }
        };
    let horizontalyAxis = {
            axisLabel: {
                ...TextStyle
            },
        };
    return {
        title: {
            text: splitTitle(title),
            right: 'center',
            top: '30px',
            ...TextStyle
        },
        grid: {
            top: 100,
            right: 50,
            left: 10,
            show: true,
            label: {
                color: "#222",
                ...TextStyle,
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c}'
        },
        toolbox: {
            orient: horizontal ? "horizontal" : "vertical",
            left: "center",
            bottom: "0px",
            feature: {
                dataView: {
                    title: "View Table",
                    icon: Icons.dataView,
                    backgroundColor: "#ffffff"
                },
                saveAsImage: {
                    type: "jpg",
                    title: "Save Image",
                    icon: Icons.saveAsImage,
                    backgroundColor: "#ffffff"
                }
            },
            backgroundColor: "#ffffff"
        },
        xAxis: horizontal ? horizontalxAxis : {
            axisLabel: {
                ...TextStyle
            },
        },
        yAxis: horizontal ? horizontalyAxis : {
            data: axisLabels,
            axisLabel: {
                show: false
            },
            axisTick: {
                show: false
            }
        },
        series: [{
            data: data,
            type: 'bar',
            label: {
                formatter: function(params) {
                    return params.data.name;
                },
                position: 'insideLeft',
                show: true,
                color: "#222",
                fontFamily: "Raleway",
                padding: 5,
                backgroundColor: 'rgba(255,255,255,.8)',
                textStyle: {
                    ...TextStyle.textStyle,
                    fontSize: 12,
                }
            }
        }],
        ...dataZoom,
        ...Color,
        ...Easing,
        ...backgroundColor
    }
}

export default Bar;
