import { Easing, Color, TextStyle, backgroundColor, Icons } from '../features/animation.js';

const Bar = (data, title, subtitle, calc) => {
    let values = data.map((x) => x.value);
    let labels = data.map((x) => x.name);
    let option = {
        ...Color,
        title : {
            text: title,
            subtext: subtitle,
            left: 'center',
            top: '20px',
            ...TextStyle
        },
        grid: {
            top: "20%",
            show: true
        },
        tooltip: {
            trigger: "item",
            formatter: "{b}: {c}",
            backgroundColor: "#ffffff",
            ...TextStyle
        },
        toolbox: {
            show: true,
            orient: 'horizontal',
            left: 'left',
            top: 'top',
            feature: {
                dataView: {
                    title: 'View Data',
                    lang: ['Data View', 'Turn Off', 'Refresh'],
                    icon: Icons.dataView,
                    buttonColor: '#0478a9'
                },
                saveAsImage: {
                    type: 'jpg',
                    title: 'Save Image',
                    icon: Icons.saveAsImage,
                    backgroundColor: '#ffffff'
                },
            },
        },
        yAxis: {
            type: 'category',
            data: labels,
        },
        xAxis: {
            type: 'value'
        },
        series: [
            {
                data: values,
                type: 'bar'
            },
        ],
        ...backgroundColor,
        ...Easing,
    };
    return option;
}

export default Bar;