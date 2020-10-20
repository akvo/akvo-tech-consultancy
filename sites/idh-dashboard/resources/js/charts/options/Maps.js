import { Color, Easing, Legend, TextStyle, ToolBox, ToolBoxMaps, backgroundColor, splitTitle, dataZoom } from "../chart-options.js";
import maxBy from "lodash/maxBy";
import minBy from "lodash/minBy";

const Maps = (title, data) => {
    const world = require("../" + data.maps + ".js");
    let records = data.records;
    return {
        title: {
            text: splitTitle(title),
            right: "center",
            top: "30px",
            ...TextStyle,
        },
        tooltip: {
            trigger: "item",
            showDelay: 0,
            transitionDuration: 0.2,
            formatter: function(params) {
                if (params.value) {
                    var value = (params.value + "").split(".");
                    value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, "$1,");
                    return params.seriesName + "<br/>" + params.name + ": " + value;
                }
                return "No Data";
            },
            backgroundColor: "#ffffff",
            ...TextStyle,
        },
        visualMap: {
            bottom: "40px",
            left: "center",
            orient: "horizontal",
            itemHeight: "200px",
            itemWidth: "9px",
            min: records.length > 1 ? minBy(records, "value").value : 0,
            max: records.length > 1 ? maxBy(records, "value").value : records[0]["value"],
            text: ["Max", "Min"],
            realtime: false,
            calculable: true,
            inRange: {
                color: ["#ffc107", Color.color[0]],
            },
        },
        toolbox: {
            ...ToolBox.toolbox,
        },
        series: [
            {
                name: title,
                type: "map",
                roam: false,
                map: data.maps,
                aspectScale: 1,
                emphasis: {
                    label: {
                        show: false,
                    },
                },
                zoom: 1,
                itemStyle: {
                    areaColor: "#f1f1f5",
                    emphasis: {
                        areaColor: "#ffc107",
                        shadowColor: "rgba(0, 0, 0, 0.5)",
                        shadowBlur: 10,
                    },
                },
                data: records,
            },
        ],
        ...Color,
        ...Easing,
        ...backgroundColor,
    };
};

export default Maps;
