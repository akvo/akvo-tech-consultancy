import { Easing, TextStyle, backgroundColor, Color, Icons, Graphic } from '../features/animation.js';

const Maps = (title, subtitle, list) => {
    let option = {
        title : {
            text: title,
            left: 'center',
            top: '20px',
            subtext: subtitle,
            ...TextStyle
        },
        tooltip: {
            trigger: 'item',
            showDelay: 0,
            transitionDuration: 0.2,
            formatter: list.formatter,
            backgroundColor: "#ffffff",
            ...TextStyle
        },
        visualMap: {
            left: 'left',
            min: list.min,
            max: list.max,
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
                name: title,
                type: 'map',
                roam: false,
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
                        areaColor: "#cdb62c",
                        color: '#FFF',
                    }
                },
                data: list.data
            }
        ],
        ...backgroundColor,
        ...Easing,
    };
    if (list.override) {
        option = {
            ...option,
            ...list.override
        }
    }
    return option;
}

export default Maps;
