import { Color, Easing, Legend, TextStyle, backgroundColor, Icons, dataView } from '../features/animation.js';
import maxBy from 'lodash/maxBy';
import sum from 'lodash/sum';

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
    if (sum(values) === 0) {
        return {
            title : {
                text: title,
                subtext: "No Data",
                left: 'center',
                top: '20px',
                ...TextStyle
            },
        }
    }
    let option = {
        title : {
            text: title,
            subtext: subtitle,
            left: 'center',
            top: '20px',
            ...TextStyle
        },
        toolbox: {
            show: true,
            orient: "horizontal",
            left: "right",
            top: "bottom",
            feature: {
                dataView: dataView,
                saveAsImage: {
                    type: "jpg",
                    title: "Save Image",
                    icon: Icons.saveAsImage,
                    backgroundColor: "#ffffff"
                }
            }
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
