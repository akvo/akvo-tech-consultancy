import { Color, Easing, Legend, TextStyle, backgroundColor, Icons } from '../features/animation.js';
import maxBy from 'lodash/maxBy';

const Radar = (title, subtitle, props, data, extra) => {
    let values = data.length > 0 ? data.map(x => x.value) : [];
    let indicator = [];
    if (data.length > 0) {
        indicator = data.map(x => {
            return {
                name: x.name,
                max: maxBy(data, 'value').value
            }
        });
    }
    console.log(values, indicator)
    let option = {
        title : {
            text: title,
            subtext: subtitle,
            left: 'center',
            top: '20px',
            ...TextStyle
        },
        radar: {
            indicator: indicator,
            radius: 120,
            startAngle: 90,
            splitNumber: 4,
            name: {
                formatter: '{value}',
                ...TextStyle,
                fontSize:14
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.5)'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.5)'
                }
            }
        },
        series: [{
            type: 'radar',
            data: [{
                value: values,
            }]
        }]
    }
    return option;
}

export default Radar;
