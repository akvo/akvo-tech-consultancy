import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';
import sumBy from 'lodash/sumBy';
import difference from 'lodash/difference';
import { parentDeep } from '../utils.js';
import {
    Color,
    Easing,
    Legend,
    TextStyle,
    backgroundColor,
    Icons
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

const getLevelOption = () => {
    return [
        {
            itemStyle: {
                borderColor: '#355c7d',
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
                borderColor: '#355c7d',
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
                borderColorSaturation: 0.6
            }
        }
    ];
}

const generateOptions = (props) => {
    let countries = props.data.filtered;
        countries = countries.length === 0 ? props.data.master : countries;
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
                let records = country.map(c => {
                    let attr = props.page.countries.find(cm => cm.id === c.country_id);
                    let value = c.values.find(v => v.id === x);
                    return {
                        name: attr.name,
                        value: value.total
                    }
                });
                selected = {
                    id: x,
                    name: selected.name,
                    value: sumBy(records, 'value'),
                }
                selectedfilters.push(selected);
            }
        }
    });
    results = remapParent(props.page.filters, selectedfilters);
    return results;
}

const TreeMap = (title, subtitle, props, extra={}) => {
    let data = generateOptions(props);
    let option = {
        ...Color,
        title: {
            show:false
        },
        tooltip: {
            show:false,
        },
        toolbox: {
            show: true,
            orient: "horizontal",
            left: "right",
            top: "top",
            feature: {
                dataView: {
                    title: "View Data",
                    lang: ["Data View", "Turn Off", "Refresh"],
                    icon: Icons.dataView,
                    buttonColor: "#0478a9",
                    textAreaBorderColor: "#fff"
                },
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
                name: 'Actions',
                type: 'treemap',
                visibleMin: 300,
                label: {
                    show: true,
                    fontFamily:"Assistant",
                    formatter: function(x){
                        return x.name + '\n\n' + x.value;
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
                levels: getLevelOption(),
                breadcrumb: {
                    itemStyle: {
                        textStyle: {
                            borderWidth:.5,
                            fontFamily:"Assistant",
                        }
                    },
                    top:10,
                },
                data: data
            }
        ],
        ...backgroundColor,
        ...Color,
        ...Easing,
        ...extra
    };
    return option;
};

export default TreeMap;
