import { Easing, TextStyle, backgroundColor, Color, Icons, Graphic } from '../features/animation.js';

const Maps = (data, subtitle, valtype, locations) => {
    valtype = "value_" + valtype;
    let list = locations.map((x) => {
        return {
            name: x.text,
            code: x.code,
            value: x.values[valtype] === 0 ? 1 : x.values[valtype],
            values: x.values,
            details: x.details
        }
    });
    let max = 1;
    let min = 0;
    let values = list.map(x => x.value);
    if (list.length > 1){
        min = values.sort((x, y) => x - y)[0];
        max = values.sort((x, y) => y - x)[0];
    }
    let option = {
        title : {
            text: data.name,
            left: 'center',
            top: '20px',
            subtext: subtitle,
            ...TextStyle
        },
        tooltip: {
            trigger: 'item',
            showDelay: 0,
            transitionDuration: 0.2,
            formatter: function (params) {
                if (params.value) {
                    var value = (params.value + '').split('.');
                    value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
                    let list = [];
                    for (let k in params.data.values) {
                        if (k.includes("_achived")){
                            list = [
                                ...list,
                                k.replace("_achived", "").toUpperCase() + ": " + params.data.values[k]
                            ];
                        };
                    }
                    let details = [];
                    for (let k in params.data.details) {
                        details = [
                            ...details,
                            k.toUpperCase() + ": " + params.data.details[k]
                        ];
                    }
                    return params.seriesName + '<br/>' + params.name + ': ' + value + '<hr/>' + list.join('<br/>') + '<hr/>' + details.join('<br/>') ;
                }
                return params.seriesName + '<br/>' + params.name + ': No Data';
            },
            backgroundColor: "#ffffff",
            ...TextStyle
        },
        visualMap: {
            left: 'left',
            min: min,
            max: max,
            backgroundColor: '#eeeeee',
            itemWidth: 10,
            inRange: {
                color: ['#007bff','#9262b7','#254464']
            },
            itemHeight: '445px',
            text: ['Max', 'Min'],
            calculable: true,
            ...TextStyle
        },
        toolbox: {
            show: true,
            orient: 'horizontal',
            left: 'right',
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
            z: 202
        },
        series: [
            {
                name: data.name,
                type: 'map',
                roam: true,
                map: 'kenya',
                aspectScale: 1,
                emphasis: {
                    label: {
                        show: false,
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
                        areaColor: "#ff4444",
                        color: '#FFF',
                    }
                },
                data: list
            }
        ],
        ...backgroundColor,
        ...Easing,
    };
    return option;
}

export default Maps;
