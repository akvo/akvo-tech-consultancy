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
        geo: {
            map: 'uganda',
            roam: true,
            aspectScale: 1,
            emphasis:{
                itemStyle: {
                    areaColor: null,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowBlur: 20,
                    borderWidth: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
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
        },
        visualMap: {
            orient: 'vertical',
            left: 'left',
            min: list.min,
            max: list.max,
            backgroundColor: '#fff',
            itemWidth: 10,
            inRange: {
                color: ['#b6c4da','#bde2f2', '#40a4dc', '#567ba9', '#085fa6'],
            },
            itemHeight: '620px',
            text: ['Max', 'Min'],
            calculable: true,
            bottom: 10,
            left: 10,
            ...TextStyle
        },
        toolbox: {
            show: true,
            orient: 'horizontal',
            right: 'right',
            bottom: 10,
            right: 10,
            feature: {
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
                geoIndex: 0,
                emphasis: {
                    label: {
                        show: true,
                    }
                },
                data: list.data
            },
        ],
        backgroundColor: '#fff',
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
