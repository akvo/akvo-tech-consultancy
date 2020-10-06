import {
    Color,
    Icons,
    Easing,
    Legend,
    TextStyle,
    backgroundColor,
    splitTitle,
    dataZoom,
} from '../chart-options.js';

export const Histogram = (title, data) => {
    let values = data.data.map(x => {
        return {
            name: x.name,
            type: 'bar',
            data: x.data
        };
    });
    let legend = data.data.map(x => x.name);
    return {
        title: {
            text: splitTitle(title),
            right: 'center',
            top: '30px',
            ...TextStyle
        },
        grid: {
            top: 100,
            right: 30,
            left: 30,
            show: true,
            label: {
                color: "#222",
                ...TextStyle,
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        toolbox: {
            orient: "horizontal",
            left: "center",
            bottom: "0px",
            feature: {
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
                }
            },
            backgroundColor: "#ffffff"
        },
        legend: {
            data: legend
        },
        xAxis: [{
            type: 'category',
            data: data.list,
            axisPointer: {
                type: 'shadow'
            }
        }],
        yAxis: {
            name: 'Count',
            axisLabel: {
                ...TextStyle
            },
        },
        series: values,
        ...dataZoom,
        ...Color,
        ...Easing,
        ...backgroundColor
    }
}

export default Histogram;
