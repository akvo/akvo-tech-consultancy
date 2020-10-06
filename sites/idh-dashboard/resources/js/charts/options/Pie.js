import {
    Color,
    Icons,
    Easing,
    Legend,
    TextStyle,
    backgroundColor,
    splitTitle,
} from '../chart-options.js';
import sumBy from 'lodash/sumBy';

export const Pie = (title, data) => {
    let legends = data.map(x => x.name);
    let total = [{name: 'total', value: sumBy(data, 'value')}];
    return {
        title: {
            text: splitTitle(title),
            right: 'center',
            top: '30px',
            ...TextStyle
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
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
        legend: {
            data: legends,
            ...Legend,
        },
        series: [{
                type: 'pie',
                radius: ['40%', '60%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: false,
                    }
                },
                labelLine: {
                    show: false
                },
                data: data
            },{
                type: 'pie',
                radius: ['0%', '0%'],
                label: {
                    show: true,
                    position: 'center',
                    fontWeight: 'bold',
                    color: '#0072c6',
                    formatter: function(params) {
                        return 'Total\n' + params.data.value;
                    }
                },
                labelLine: {
                    show: false
                },
                data: total,
                color: ['#fff'],
            }
        ],
        ...Color,
        ...Easing,
        ...backgroundColor
    };
}

export default Pie;
