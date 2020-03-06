import { Easing } from '../features/animation.js';

const Maps = (data, title, calc) => {
    let values = data.map(x => x.value)
    let max = 1;
    let min = 0;
    if (values.length > 1){
        min = values.sort((x, y) => x - y)[0];
        max = values.sort((x, y) => y - x)[0];
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
                if (params.value) {
                    var value = (params.value + '').split('.');
                    value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
                    return params.seriesName + '<br/>' + params.name + ': ' + value;
                }
                return 'No Data';
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
            orient: 'horizontal',
            left: 'left',
            top: 'top',
            feature: {
                dataView: {
                    title: 'View Data',
                    lang: ['Data View', 'Turn Off', 'Refresh'],
                    buttonColor: '#0478a9'
                },
                saveAsImage: {
                    type: 'jpg',
                    title: 'Save Image',
                    backgroundColor: '#ffffff'
                },
            },
            z: 202
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
                zoom: 1,
                scaleLimit: {
                    min:1,
                    max:7
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
