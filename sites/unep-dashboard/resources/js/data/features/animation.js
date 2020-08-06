import { formatCurrency } from '../utils.js';

export const backgroundColor = {
    backgroundColor: "#fff"
};

export const Easing = {
    animation: true,
    animationThreshold: 2000,
    animationDuration: 1000,
    animationEasing: "cubicOut",
    animationDelay: 0,
    animationDurationUpdate: 300,
    animationEasingUpdate: "cubicOut",
    animationDelayUpdate: 0
};

export const TextStyle = {
    textStyle: {
        color: "#222",
        fontFamily: "Assistant"
    }
};

export const Color = {
    color: [
        "#007bff",
        "#ff7043",
        "#2BBBAD",
        "#ffbb33",
        "#ff4444",
        "#33b5e5",
        "#00C851",
        "#4285F4",
        "#aa66cc",
        "#b2dfdb",
        "#b3e5fc",
        "#8d6e63",
        "#f78bba",
        "#231fa1"
    ]
};

export const Legend = {
    orient: "vertical",
    x: "left",
    y: 80,
    textStyle: {
        fontFamily: "Assistant",
        fontWeight: 200,
        fontSize: 12
    },
    padding: 10,
    icon: "circle"
};

export const Icons = {
    saveAsImage:
        "path://M1412 897q0-27-18-45l-91-91q-18-18-45-18t-45 18l-189 189v-502q0-26-19-45t-45-19h-128q-26 0-45 19t-19 45v502l-189-189q-19-19-45-19t-45 19l-91 91q-18 18-18 45t18 45l362 362 91 91q18 18 45 18t45-18l91-91 362-362q18-18 18-45zm252-1q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z",
    dataView:
        "path://M1596 476q14 14 28 36h-472v-472q22 14 36 28zm-476 164h544v1056q0 40-28 68t-68 28h-1344q-40 0-68-28t-28-68v-1600q0-40 28-68t68-28h800v544q0 40 28 68t68 28zm160 736v-64q0-14-9-23t-23-9h-704q-14 0-23 9t-9 23v64q0 14 9 23t23 9h704q14 0 23-9t9-23zm0-256v-64q0-14-9-23t-23-9h-704q-14 0-23 9t-9 23v64q0 14 9 23t23 9h704q14 0 23-9t9-23zm0-256v-64q0-14-9-23t-23-9h-704q-14 0-23 9t-9 23v64q0 14 9 23t23 9h704q14 0 23-9t9-23z"
};

export const Graphic = {
    graphic: [
        {
            type: "image",
            id: "logo",
            right: 50,
            bottom: 50,
            z: -10,
            bounding: "raw",
            origin: [75, 75],
            style: {
                image: "/images/logo-unep.png",
                width: 50,
                height: 50,
                opacity: 0.4
            }
        }
    ]
};

export const optionToContent = (params) => {
    let data = params.series[0].data;
    let charttype = params.series[0].type;
    if (charttype === "sankey") {
        data = params.series[0].links;
        if (data.length > 0) {
            data = data.map(x => {
                return {
                    name: x.target,
                    value: x.value
                }
            });
        }
    }
    if (charttype === "bar") {
        let names = params.yAxis[0].type === "value" ? params.xAxis[0].data : params.yAxis[0].data;
        data = data.map((x, i) => {
            return {
                name: names[i],
                value: x
            }
        });
    }
    if (charttype === "radar") {
        let names = params.radar[0].indicator;
        data = data[0].value.map((x, i) => {
            return {
                name: names[i].name,
                value: x
            }
        });
    }
    let html = '<table class="table table-bordered table-table-view">';
    html += '<thead class="thead-dark"><tr class="sm bg-dark text-white">';
    html += '<td width="100">Indicator</td><td width="50" align="center">Value</td>'
    html += '</tr></thead">';
    html += '<tbody>';
    if (data.length > 0) {
        data.forEach(x => {
            let child = x.children !== undefined ? (x.children.length > 0 ? true : false) : false;
            html += '<tr class="sm">';
            html += '<td width="50">'+ (child ? ('<strong>' + x.name + '</strong>') : x.name) +'</td>';
            html += '<td width="50" align="right">' + (
                child ? ('<strong>' + formatCurrency(x.value) + '</strong>') : formatCurrency(x.value)) +'</td>';
            html += '</tr>';
            if (child) {
                x.children.forEach(c => {
                    html += '<tr class="sm">';
                    html += '<td width="50" style="padding-left:30px!important;">'+ c.name +'</td>';
                    html += '<td width="50" align="right">' + formatCurrency(c.value) +'</td>';
                    html += '</tr>';
                })
            }

        });
    }
    html += '</tbody">';
    html += '</table>';
    return html;
}

export const dataView = {
    title: "Table View",
    lang: ["Table View", "Back to Chart", "Refresh"],
    icon: Icons.dataView,
    buttonColor: "#009fe2",
    readOnly: true,
    textAreaBorderColor: "#fff",
    optionToContent: optionToContent
}
