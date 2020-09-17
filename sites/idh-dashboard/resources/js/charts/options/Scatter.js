import {
    Color,
    Easing,
    Legend,
    TextStyle,
    backgroundColor,
} from '../chart-options.js';

export const Scatter = (title, data) => {
    return {
        title: {
            text: title,
            right: 'center',
            top: '20px',
            ...TextStyle,
        },
        xAxis: {
            type: 'value',
            name: data.xAxis,
            nameLocation: 'end',
            nameGap: 20,
            nameTextStyle: {
                color: '#000',
                fontSize: 16
            }
        },
        yAxis: {
            type: 'value',
            name: data.yAxis,
            nameLocation: 'end',
            nameGap: 20,
            nameTextStyle: {
                color: '#000',
                fontSize: 16
            }
        },
        series: [{
            symbolSize: 20,
            data: data.data,
            type: 'scatter'
        }],
        ...Color,
        ...Easing,
        ...backgroundColor
    };
}

export default Scatter;
