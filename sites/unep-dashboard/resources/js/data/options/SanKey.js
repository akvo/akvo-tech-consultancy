import {
    Color,
    Easing,
    Legend,
    LegendReports,
    TextStyle,
    TextStyleReports,
    backgroundColor,
    Icons,
    dataView
} from "../features/animation.js";
import { flatten } from "../utils.js";
import uniq from  'lodash/uniq';

const createLinks = (data, links) => {
    if (data.children.length > 0) {
        data.children.forEach(x => {
            if (x.datapoints !== undefined) {
                if (x.datapoints.length > 0) {
                    links.push({
                        source: data.name,
                        target: x.name,
                        value: x.datapoints.length
                    });
                }
            } else {
                links.push({
                    source: data.name,
                    target: x.name,
                });
            }
            createLinks(x, links)
        })
    }
    return links;
}

const SanKey = (title, subtitle, props, data, extra, reports=false) => {
    let list = [];
    let links = [];
    if (data) {
        list = data.filter(x => x.children.length > 0);
        list = flatten(list);
        list = list.map(x => x.name);
        list = uniq(list);
        list = list.map(x => {
            return {name: x};
        });
        data.forEach(x => {
            links = [...links, ...createLinks(x, [])];
        });
    }
    const text_style = reports ? TextStyleReports : TextStyle;
    let option = {
        title: {
            text: reports ? (title + " (" + subtitle + ")" ) : title,
            subtext: reports ? "" : subtitle,
            left: 'center',
            top: '20px',
            ...text_style,
        },
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove',
            backgroundColor: "#f2f2f2",
            formatter: function(par) {
                let name = par.data.source.split('(')[0];
                name += '> ' + par.data.target.split('(')[0];
                name += ' :' + par.data.value;
                return name;
            },
            padding:5,
            borderRadius:5,
            position: [30,50],
            textStyle: {
                ...text_style.textStyle,
                fontSize:12
            }
        },
        toolbox: {
            show: reports ? false : true,
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
                top: reports ? "70vh" : "20%",
                type: 'sankey',
                layout: 'none',
                focusNodeAdjacency: 'allEdges',
                data: list,
                links: links,
                nodeGap: 20,
                label: {
                    formatter: function(params) {
                        let name = params.name;
                        name = name.split('(')[0];
                        name = name.split('e.g')[0];
                        return name;
                    },
                    color: "#222",
                    fontFamily: reports ? "sans-serif" : "Assistant",
                    ...text_style,
                },
                lineStyle: {
                    curveness: reports ? .8 : .3,
                    color: 'rgba(0,0,0,.3)',
                },
            }
        ],
        ...Color,
    }
    return option;
}

export default SanKey;
