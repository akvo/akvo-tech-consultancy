import {
    Color,
    Icons,
    Easing,
    Legend,
    TextStyle,
    dataZoom,
    backgroundColor,
    splitTitle,
} from '../chart-options.js';

export const Scatter = (title, data) => {
    return {
        title: {
            text: splitTitle(title),
            right: 'center',
            top: '0px',
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
            }
        },
        toolbox: {
            orient: "horizontal",
            left: "center",
            bottom: "0px",
            feature: {
                brush: {
                    title: {
                        "polygon" : "Polygon Select",
                        "clear" : "Clear Selection",
                    },
                    type: ['rect', 'clear']
                },
                dataView: {
                    title: "View Table",
                    icon: Icons.dataView,
                    backgroundColor: "#ffffff"
                },
                saveAsImage: {
                    type: "jpg",
                    title: "Save Image",
                    icon: Icons.saveAsImage,
                    backgroundColor: "#ffffff"
                },
            },
            backgroundColor: "#ffffff"
        },
        xAxis: {
            type: 'value',
            name: data.xAxis,
            nameLocation: 'end',
            nameGap: 20,
            nameTextStyle: {
                ...TextStyle.textStyle,
            }
        },
        yAxis: {
            type: 'value',
            name: data.yAxis,
            nameLocation: 'end',
            nameGap: 20,
            nameTextStyle: {
                ...TextStyle.textStyle
            }
        },
        series: [{
            symbolSize: 20,
            data: data.data,
            symbolSize: 15,
            type: 'scatter'
        }],
        ...dataZoom,
        ...Color,
        ...Easing,
        ...backgroundColor
    };
}

export default Scatter;
