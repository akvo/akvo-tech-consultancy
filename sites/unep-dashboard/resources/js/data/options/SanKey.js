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
import sumBy from  'lodash/sumBy';
import sortBy from  'lodash/sortBy';

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
        let otherandall = links.filter(x => x.target === "All of the above" || x.target === "Other");
        if (otherandall.length > 1) {
            links = links.map(x => {
                if (x.target === "All of the above" || x.target === "Other") {
                    let parent = x.source.split(' (')[0];
                    return {
                        ...x,
                        target: x.target + " (" + parent +")"
                    };
                }
                return x;
            });
            list = links.map(x => x.target);
            list = [...uniq(links.map(x => x.source)), ...list];
            list = list.map(x => {
                return {name: x};
            });
        }
        links = sortBy(links, 'value');
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
                let name = par.data.name;
                if (par.dataType === "edge") {
                    name = par.data.source.split('(')[0];
                    name += '> ' + par.data.target.split('(')[0];
                    name += ' :' + par.data.value;
                }
                if (par.dataType === "node") {
                    name += ':' + par.value;
                }
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
            top: "top",
            feature: {
                dataView: dataView(props.locale.lang),
                saveAsImage: {
                    type: "jpg",
                    title: props.locale.lang.saveImage,
                    icon: Icons.saveAsImage,
                    backgroundColor: "#ffffff"
                }
            },
            backgroundColor: "#ffffff"
        },
        series: [
            {
                top: reports ? "70vh" : "20%",
                type: 'sankey',
                layout: 'none',
                focusNodeAdjacency: 'allEdges',
                data: list,
                links: links,
                nodeGap: 5,
                label: {
                    formatter: function(params) {
                        let name = params.name;
                        let value = links.find(x => x.target === name);
                        if (value === undefined){
                            value = links.filter(x => x.source === name);
                            value = sumBy(value, 'value');
                        } else {
                            value = value.value;
                        }
                        name = name.split('(')[0];
                        name = name.split('e.g')[0];
                        name = name.split('/')[0];
                        return name + '(' + value + ')';
                    },
                    color: "#222",
                    fontFamily: reports ? "sans-serif" : "Assistant",
                    ...text_style,
                },
                lineStyle: {
                    curveness: reports ? .8 : .5,
                    color: 'rgba(0,0,0,.3)',
                },
            }
        ],
        ...Color,
    }
    return option;
}

export default SanKey;
