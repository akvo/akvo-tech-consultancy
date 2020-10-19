import { Color, Icons, Easing, Legend, TextStyle, ToolBox, dataZoom, backgroundColor, splitTitle } from "../chart-options.js";

export const Scatter = (title, data) => {
    return {
        title: {
            text: splitTitle(title),
            right: "center",
            top: "30px",
            ...TextStyle,
        },
        grid: {
            top: 100,
            right: 100,
            left: 100,
            show: true,
            label: {
                color: "#222",
                ...TextStyle,
            },
        },
        xAxis: {
            type: "value",
            name: data.xAxis,
            nameLocation: "end",
            nameGap: 20,
            nameTextStyle: {
                ...TextStyle.textStyle,
            },
        },
        yAxis: {
            type: "value",
            name: data.yAxis,
            nameLocation: "end",
            nameGap: 20,
            nameTextStyle: {
                ...TextStyle.textStyle,
            },
        },
        series: [
            {
                symbolSize: 20,
                data: data.data,
                symbolSize: 15,
                type: "scatter",
            },
        ],
        ...dataZoom,
        ...Color,
        ...Easing,
        ...backgroundColor,
        ...ToolBox,
    };
};

export default Scatter;
