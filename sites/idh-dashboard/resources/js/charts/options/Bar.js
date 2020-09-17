import {
    Color,
    Easing,
    Legend,
    TextStyle,
    backgroundColor,
} from '../chart-options.js';

export const Bar = (title, data) => {
    let axisLabels = data.map(x => x.name);
    return {
        title: {
            text: title,
            right: 'center',
            top: '20px',
            ...TextStyle
        },
        xAxis: {
            data: axisLabels,
            axisLabel: {
                ...TextStyle
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            z: 10
        },
        yAxis: {
            axisLine: {
                show: false
            },
            axisTick: {
                show: true
            }
        },
        series: [{
            type: 'bar',
            itemStyle: {
                color: "#83bff6"
            },
            emphasis: {
                itemStyle: {
                    color: "#83bff6"
                }
            },
            data: data
        }],
        ...Color,
        ...Easing,
        ...backgroundColor
    }
}

export default Bar;
