import { Color, Icons, Easing, Legend, ToolBox, TextStyle, backgroundColor, splitTitle, dataZoom } from "../chart-options.js";
import sum from "lodash/sum";
import sortBy from "lodash/sortBy";

export const Bar = (title, data, horizontal = false, unsorted = false) => {
    let tableData = sortBy(data, "name");
    tableData = tableData.map((x) => {
        return [x.name, x.value];
    });
    tableData = {
        header: [title, "Count"],
        data: tableData,
    };
    data = sortBy(data, unsorted ? "name" : "value");
    let axisLabels = data.map((x) => x.name);
    let values = data.map((x) => x.value);
    let avg = 0;
    if (values.length > 0) {
        avg = sum(values) / values.length;
        avg = avg < 100 ? true : false;
    }
    let horizontalxAxis = {
        data: axisLabels,
        axisLabel: {
            show: horizontal ? true : false,
        },
        axisTick: {
            show: horizontal ? true : false,
        },
    };
    let horizontalyAxis = {
        axisLabel: {
            show: true,
        },
        axisTick: {
            show: true,
        },
    };
    return {
        title: {
            text: splitTitle(title),
            right: "center",
            top: "30px",
            ...TextStyle,
        },
        grid: {
            top: 100,
            right: 50,
            left: horizontal ? 35 : 10,
            show: true,
            label: {
                color: "#222",
                ...TextStyle,
            },
        },
        tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c}",
        },
        legend: {
            ...Legend,
        },
        xAxis: horizontal ? horizontalxAxis : horizontalyAxis,
        yAxis: horizontal ? horizontalyAxis : horizontalxAxis,
        series: [
            {
                data: data,
                type: "bar",
                label: {
                    formatter: function(params) {
                        return params.data.name;
                    },
                    position: "insideLeft",
                    show: horizontal ? false : true,
                    color: "#222",
                    fontFamily: "Raleway",
                    padding: 5,
                    backgroundColor: "rgba(255,255,255,.8)",
                    textStyle: {
                        ...TextStyle.textStyle,
                        fontSize: 12,
                    },
                },
            },
        ],
        data: tableData,
        ...Color,
        ...Easing,
        ...backgroundColor,
        ...ToolBox,
    };
};

export default Bar;
