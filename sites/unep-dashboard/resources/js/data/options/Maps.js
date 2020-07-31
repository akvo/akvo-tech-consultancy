import { Easing, TextStyle, backgroundColor, Color, Icons, Graphic } from '../features/animation.js';
import flattenDeep from 'lodash/flattenDeep';
import uniq from 'lodash/uniq';

const getData = (data, countries) => {
    let results = [];
    if (countries.length === 1) {
        return results;
    }
    results = data.map(x => {
        let country = countries.find(c => c.id === x.country_id);
        return {
            name: country.name,
            value: x.global + x.total,
            data: x
        }
    });
    results = results.filter(x => x.value !== 0);
    return results;
}

const Maps = (title, subtitle, props, extra={}) => {
    let source = props.data.filters.length > 0 || props.data.countries.length > 0
        ? props.data.filtered : props.data.master;
    let data = getData(source, props.page.countries);
    let values = [];
    let max = 1;
    let min = 0;
    if (data.length > 0) {
        values = data.map(x => x.value);
        if (values.length > 1){
            min = values.sort((x, y) => x - y)[0];
            max = values.sort((x, y) => y - x)[0];
            min = min === max ? 0 : min;
        }
    }
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
            formatter: function (params) {
                if (params.value) {
                    var value = (params.value + '').split('.');
                    value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
                    return params.seriesName + '<br/>' + params.name + ': ' + value;
                }
                return 'No Data';
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
                color: ['#fff', '#007bff']
            },
            itemHeight: '445px',
            text: ['High', 'Low'],
            calculable: true,
            ...TextStyle
        },
        toolbox: {
            show: true,
            orient: 'horizontal',
            left: 'right',
            bottom: 'bottom',
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
                roam: true,
                map: 'world',
                aspectScale: 1,
                emphasis: {
                    label: {
                        show: false,
                    }
                },
                zoom: 1,
                scaleLimit: {
                    min:1.1,
                    max:1.1
                },
                itemStyle: {
                    areaColor: '#ddd',
                    emphasis: {
                        areaColor: "#ff4444",
                        color: '#FFF',
                    }
                },
                data: data
            }
        ],
        ...backgroundColor,
        ...Easing,
        ...extra
    };
    return option;
}

export default Maps;
