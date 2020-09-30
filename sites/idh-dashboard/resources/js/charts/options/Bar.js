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

export const Bar = (title, data) => {
    let axisLabels = data.map(x => x.name);
    let values = data.map(x => x.value);
    let avg = 0;
    if (values.length > 0) {
        avg = sum(values) / values.length;
        avg = avg < 100 ? true : false;
    }
    return {
        title: {
            text: splitTitle(title),
            right: 'center',
            top: '0px',
            ...TextStyle
        },
        grid: {
            top: 100,
            right: 100,
            left: 100,
            show: true,
            label: {
                color: "#222",
                ...TextStyle,
            }
        },
        tooltip: {
            show: true,
            trigger: "item",
            formatter: "{b}",
            padding:5,
            backgroundColor: "#f2f2f2",
            ...TextStyle,
        },
        toolbox: {
            orient: "horizontal",
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
        xAxis: {
            axisLabel: {
                ...TextStyle
            },
        },
        yAxis: {
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
                borderRadius: avg ? 20 : 5,
                backgroundColor: 'rgba(255,255,255,.3)',
                ...TextStyle,
            }
        }],
        ...dataZoom,
        ...Color,
        ...Easing,
        ...backgroundColor
    }
}

export default Bar;
