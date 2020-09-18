import {
    Color,
    Icons,
    Easing,
    Legend,
    TextStyle,
    backgroundColor,
    splitTitle,
} from '../chart-options.js';

export const Pie = (title, data) => {
    let legends = data.map(x => x.name);
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
            top: "0px",
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
            radius: ['30%', '50%'],
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
