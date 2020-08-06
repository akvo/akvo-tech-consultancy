import { Easing, TextStyle, backgroundColor, Color, Icons, Graphic, dataView } from '../features/animation.js';
import flattenDeep from 'lodash/flattenDeep';
import uniq from 'lodash/uniq';
import sumBy from 'lodash/sumBy';
import intersection from 'lodash/intersection';

const getData = (data, page, countries, contrib, {global, datapoints, filteredpoints}) => {
    let results = [];
    if (countries.length === 1) {
        return results;
    }
    results = data.map(x => {
        let country = countries.find(c => c.id === x.country_id);
        let values = global ? (x.global + x.total) : x.total;
        let dp = [];
        if (page === "funding") {
            values = 0;
            dp = [];
            x.values.forEach(x => {
                dp = [...dp, ...x.datapoints];
            });
            dp = uniq(dp);
            dp = intersection(dp, filteredpoints);
            dp = datapoints.filter(d => dp.includes(d.datapoint_id));
            if (dp.length > 0) {
                dp = contrib ? dp.map(d => {
                    return {...d, f: d.f + d.c}
                }) : dp;
                values = sumBy(dp, 'f');
            }
        }
        return {
            name: country.name,
            value: values,
            data: page === "funding" ? {...x, funds: dp} : x
        }
    });
    results = results.filter(x => x.value !== 0);
    return results;
}

const Maps = (title, subtitle, props, data, extra) => {
    if (!data) {
        let source = props.data.filters.length > 0 || props.data.countries.length > 0
            ? props.data.filtered : props.data.master;
        data = getData(
            source,
            props.page.name,
            props.page.countries,
            props.page.fundcontrib,
            props.data
        );
    }
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
                color: ['#ddd','#f8b195','#f67280','#c06c84','#6c5b7b','#355c7d'],
            },
            itemHeight: '445px',
            text: ['High', 'Low'],
            calculable: true,
            ...TextStyle
        },
        toolbox: {
            show: true,
            orient: "horizontal",
            left: "right",
            top: "bottom",
            feature: {
                dataView: dataView,
                saveAsImage: {
                    type: "jpg",
                    title: "Save Image",
                    icon: Icons.saveAsImage,
                    backgroundColor: "#ffffff"
                }
            }
        },
        series: [
            {
                name: title,
                type: 'map',
                roam: false,
                map: 'world',
                aspectScale: 1,
                emphasis:{
                    label: {
                        show: false,
                    }
                },
                zoom: 1,
                itemStyle: {
                    areaColor: '#ddd',
                    emphasis: {
                        areaColor: "#ffc107",
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                        shadowBlur: 10
                    }
                },
                data: data
            }
        ],
        ...backgroundColor,
        ...Easing,
        ...extra,
        ...Graphic
    };
    return option;
}

export default Maps;
