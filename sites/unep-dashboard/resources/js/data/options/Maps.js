import { Easing } from '../features/animation.js';

const Maps = (data, title) => {
    let values = data.map(x => x.value)
    let max = values.reduce((x,y) => x + y);
    let min = 0;
    console.log(values);
    if (values.length > 1){
        min = values.sort((x, y) => x - y)[0];
    }
    let option = {
        title : {
            text: title,
            left: 'center',
            top: 'top',
            textStyle: {
                color: '#222'
            }
        },
        tooltip: {
            trigger: 'item',
            showDelay: 0,
            transitionDuration: 0.2,
            formatter: function (params) {
                var value = (params.value + '').split('.');
                value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
                return params.seriesName + '<br/>' + params.name + ': ' + value;
            }
        },
        visualMap: {
            left: 'right',
            min: min,
            max: max,
            inRange: {
                color: ['#fff823', '#007bff']
            },
            text: ['High', 'Low'],
            calculable: true,
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            left: 'left',
            top: 'top',
            feature: {
                dataView: {
                    title: 'View Data'
                },
                restore: {
                    title: 'Restore'
                },
                brush: {
                    title: 'Brush'
                },
                saveAsImage: {
                    title: 'Save Image'
                },
            }
        },
        series: [
            {
                name: title,
                type: 'map',
                roam: true,
                map: 'world',
                aspectScale: 1,
                emphasis: {
                    label: {
                        show: true
                    }
                },
                itemStyle: {
                    areaColor: '#ddd',
                    emphasis: {
                        areaColor: '#eee',
                        color: '#222',
                    }
                },
                data: data
            }
        ],
        ...Easing,
    };
    return option;
}

export default Maps;
