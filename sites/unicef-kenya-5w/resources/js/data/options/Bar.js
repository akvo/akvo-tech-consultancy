import { Easing, Color, TextStyle, backgroundColor, Icons } from '../features/animation.js';

const Bar = (data, subtitle, valtype, locations) => {
    let labels = [];
    let values = [];
    valtype = "_" + valtype;
    for (let k in data) {
        if (k.includes(valtype)){
            labels = [...labels, k.replace(valtype, "").toUpperCase()];
            values = [...values, data[k]];
        };
    }
    let option = {
        ...Color,
        title : {
            text: data.name,
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
