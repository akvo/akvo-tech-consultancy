import {
    Color,
    Easing,
    Legend,
    TextStyle,
    backgroundColor,
    Icons
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

const SanKey = (title, subtitle, props, data, extra) => {
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
    let option = {
        title: {
            text: title,
            subtext: subtitle,
            left: 'center',
            top: '20px',
            ...TextStyle,
        },
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove',
            backgroundColor: "#f2f2f2",
            padding: 20,
            position: [30,50],
            ...TextStyle
        },
        series: [
            {
                type: 'sankey',
                layout: 'none',
                focusNodeAdjacency: 'allEdges',
                data: list,
                links: links,
                label: {
                    color: "#222",
                    fontFamily: "Assistant"
                }
            }
        ]
    }
    return option;
}

export default SanKey;
