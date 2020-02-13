import { Easing } from '../features/animation.js';

const Bar = (data, title) => {
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
        xAxis: {
            type: 'category',
            data: labels,
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: values,
            type: 'bar'
        }],
        ...Easing,
    };
    return option;
}

export default Bar;
