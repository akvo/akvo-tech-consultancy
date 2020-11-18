import { Easing, Color, TextStyle, backgroundColor, Icons } from '../features/animation.js';

const Bar = (title, subtitle, list) => {
    let option = {
        ...Color,
        title : {
            text: title,
            subtext: subtitle,
            left: '20px',
            top: '20px',
            ...TextStyle
        },
        grid: {
            top: "100px",
            left: "30%",
            show: true
        },
        tooltip: {
            trigger: "item",
            formatter: "{b}: {c}",
            backgroundColor: "#ffffff",
            ...TextStyle
        },
        yAxis: {
            type: 'category',
            data: list.labels,
            axisLabel: {
                interval: 0,
            },
        },
        xAxis: {
            type: 'value'
        },
        series: [
            {
                data: list.values,
                type: 'bar'
            },
        ],
        backgroundColor: "#ffffff",
        ...Easing,
    };
    return option;
}

export default Bar;
