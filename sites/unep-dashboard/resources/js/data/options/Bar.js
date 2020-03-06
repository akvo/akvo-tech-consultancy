import { Easing } from '../features/animation.js';

const Bar = (data, title, calc) => {
    let values = data.map((x) => x.value);
    let labels = data.map((x) => x.name);
    let option = {
        title : {
            text: title,
            left: 'center',
            top: 'top',
            textStyle: {
                color: '#222'
            }
        },
        grid: {
            show: true
        },
        tooltip: {
            trigger: "item",
            formatter: "{b}: {c}"
        },
        toolbox: {
            show: true,
            orient: 'horizontal',
            left: 'left',
            top: 'top',
            feature: {
                saveAsImage: {
                    type: 'jpg',
                    title: 'Save Image',
                    backgroundColor: '#ffffff'
                },
            }
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
        ...Easing,
    };
    return option;
}

export default Bar;
