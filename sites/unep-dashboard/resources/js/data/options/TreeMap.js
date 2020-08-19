import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';
import sumBy from 'lodash/sumBy';
import difference from 'lodash/difference';
import { parentDeep, formatCurrency } from '../utils.js';
import {
    Color,
    Easing,
    Legend,
    TextStyle,
    TextStyleReports,
    backgroundColor,
    Icons,
    dataView,
} from "../features/animation.js";

const flatall = (arr) => {
    return arr? arr.reduce((result, item) => [
        ...result,
        { id: item.id, name: item.name, parent_id: item.parent_id, childrens: item.childrens },
        ...flatall(item.childrens)
    ], []) : [];
}

const remapParent = (parent, results) => {
    return parent.map(x => {
        let children = x.childrens;
        if (children.length > 0){
            children = remapParent(children, results);
        } else {
            return results.find(r => r.id === x.id);
        }
        return {
            id: x.id,
            name: x.name,
            children: children.filter(x => x),
            value: sumBy(children, 'value')
        };
    });
}

const colorMappingChange = (value) => {
    var levelOption = getLevelOption(value);
    chart.setOption({
        series: [{
            levels: levelOption
        }]
    });
}

const getLevelOption = (reports) => {
    return [
        {
            itemStyle: {
                borderColor: reports ? '#fff' : '#355c7d',
                borderWidth: 0,
                gapWidth: 1
            },
            upperLabel: {
                fontFamily:"Assistant",
                show: false
            }
        },
        {
            itemStyle: {
                borderColor: reports ? '#fff' : '#355c7d',
                borderWidth: 5,
                gapWidth: 1
            },
            emphasis: {
                upperLabel: {
                    fontFamily:"Assistant",
                    color: '#355c7d'
                },
                itemStyle: {
                    borderColor: '#ddd'
                }
            }
        },
        {
            itemStyle: {
                borderWidth: 5,
                gapWidth: 1,
                borderColorSaturation: 0.4
            }
        },
        {
            itemStyle: {
                borderWidth: 3,
                gapWidth: 1,
                borderColorSaturation: 0.7
            }
        },
        {
            itemStyle: {
                borderWidth: 2,
                gapWidth: 1,
                borderColorSaturation: 0.4
            }
        }
    ];
}

const generateOptions = (props) => {
    let countries = props.data.filters.length === 0  && props.data.countries.length === 0
        ? props.data.master : props.data.filtered;
    let global = props.data.global;
    if (!global) {
        countries = countries.filter(x => x.total > 0);
        let datapoints = props.data.datapoints
            .filter(x => !x.global)
            .map(x => x.datapoint_id);
        countries = countries.map(x => {
            let values = x.values.map(v => {
                let dps = difference(v.datapoints, datapoints);
                return {
                    ...v,
                    datapoints: dps,
                    total: dps.length
                }
            });
            values = values.filter(v => v.total !== 0);
            return {
                ...x,
                values:values
            }
        });
    }
    let results = [];
    let filters = uniq(flatten(
        countries.map(x => x.values.map(v => v.id))
    ));
    let allfilters = flatall(props.page.filters);
    let selectedfilters = [];
    countries = countries.map(c => {
        let vids = c.values.filter(x => x.total !== 0);
        return{
            ...c,
            vids: flatten(c.values.map(v => v.id))
        }
    });
    filters.forEach(x => {
        let selected = allfilters.find(f => f.id === x);
        if (selected) {
            let country = countries.filter(c => c.vids.includes(x));
            if (country) {
                let datapoints = [];
                let total = 0;
                country.forEach(c => {
                    let attr = props.page.countries.find(cm => cm.id === c.country_id);
                    let value = c.values.find(v => v.id === x);
                    datapoints = [...datapoints, ...value.datapoints];
                });
                if (datapoints.length > 0){
                    total = uniq(datapoints).length;
                }
                selected = {
                    id: x,
                    name: selected.name,
                    value: total
                }
                selectedfilters.push(selected);
                return;
            }
        }
        return;
    });
    results = remapParent(props.page.filters, selectedfilters);
    return results;
}

const TreeMap = (title, subtitle, props, data, extra, reports=false) => {
    data = !data ? generateOptions(props) : data;
    let val;
    if (sumBy(data,'value') === 0) {
        return {
            title : {
                text: title,
                subtext: "No Data",
                left: 'center',
                top: '20px',
                ...TextStyle
            },
        }
    }
    const text_style = reports ? TextStyleReports : TextStyle;
    let option = {
        ...Color,
        title : {
            text: reports ? (title + " (" + subtitle + ")" ) : title,
            subtext: reports ? "" : subtitle,
            left: 'center',
            top: '20px',
            ...text_style
        },
        tooltip: {
            show: reports ? false : true,
            trigger: 'item',
            showDelay: 0,
            padding:5,
            backgroundColor: "#f2f2f2",
            transitionDuration: 0.2,
            formatter: function(params) {
                val = params.value;
                let name = params.name;
                if (props.page.name === "funding") {
                    val = formatCurrency(val);
                }
                name = params.name.split(':')[0];
                name = name.split('(')[0];
                return name + ":" + val;
            },
            top:'bottom',
            left: 'center',
            textStyle : {
                ...text_style.textStyle,
                fontSize:12
            }
        },
        toolbox: {
            show: reports ? false : true,
            orient: "horizontal",
            left: "right",
            top: "top",
            feature: {
                dataView: dataView,
                restore: {
                    title: "revert",
                    icon: Icons.reset,
                },
                saveAsImage: {
                    type: "jpg",
                    title: "Save Image",
                    icon: Icons.saveAsImage,
                    backgroundColor: "#ffffff"
                }
            },
            backgroundColor: "#FFF",
        },
        series: [
            {
                name: 'Actions',
                type: 'treemap',
                visibleMin: 600,
                width: '100%',
                top: reports ? "50vh" : '15%',
                roam: 'move',
                label: {
                    show: true,
                    fontFamily: reports ? "san-serif" : "Assistant",
                    fontSize: reports ? 20 : 8,
                    formatter: function(x){
                        val = x.value;
                        let name = x.name.split(':')[0];
                        if (props.page.name === "funding") {
                            val = formatCurrency(x.value);
                        }
                        if (!reports){
                            return '{title|' + name + '}' + '\n\n' + '{label|' + val + '}';
                        }
                        return '{title|' + name + '}' + '\n\n' + '{hr|}' + '\n\n\n' + '{label|' + val + '}';
                    },
                    rich:{
                        title: {
                            align: 'center',
                            color: '#ffffff',
                            fontSize: reports ? 20 : 10,
                            lineHeight: 20,
                        },
                        hr: {
                            width: '100%',
                            borderColor: 'rgba(255,255,255,0.2)',
                            borderWidth: 0.5,
                            height: 0,
                            lineHeight: 10
                        },
                        label: {
                            fontSize: reports ? 30 : 12,
                            fontWeight: 400,
                            backgroundColor: reports ? 'rgba(0,0,0,.2)' : 'rgba(0,0,0,.3)',
                            color: '#ffffff',
                            borderRadius: 100,
                            padding: 10,
                            width: reports ? 31.5 : 12.5,
                            lineHeight: 20,
                            align: 'center'
                        },
                    }
                },
                upperLabel: {
                    fontFamily:"Assistant",
                    show: true,
                    height: 30
                },
                itemStyle: {
                    borderColor: '#355c7d',
                    borderWidth: 0,
                    gapWidth: 1,
                },
                levels: getLevelOption(reports),
                breadcrumb: {
                    show: reports ? false : true,
                    itemStyle: {
                        textStyle: {
                            borderWidth:0,
                            fontFamily:"Assistant",
                        },
                        shadowColor:"transparent"
                    },
                    height:15,
                    bottom: 0,
                },
                data: data
            }
        ],
        ...backgroundColor,
        ...Color,
        //color: ['#6c5b7b','#c06c84','#f67280','#f8b195','#F59C2F','#845435','#226E7B','#2C201F'],
        ...Easing,
        ...extra
    };
    return option;
};

export default TreeMap;
