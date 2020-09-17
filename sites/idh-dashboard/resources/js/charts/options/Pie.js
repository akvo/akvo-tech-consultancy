import {
    Color,
    Easing,
    Legend,
    TextStyle,
    backgroundColor,
} from '../chart-options.js';

export const Pie = (data, title) => {
    let legends = data.map(x => x.name);
    return {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            data: legends,
            ...Legends,
        },
        series: [{
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '30',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: data
        }],
        ...Color,
        ...Easing,
        ...backgroundColor
    };
}

export default Pie;
