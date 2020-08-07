import { Easing, Color, TextStyle, backgroundColor, Icons, dataView } from '../features/animation.js';
import { formatCurrency } from '../utils.js';
import sum from 'lodash/sum';

const Bar = (title, subtitle, props, data, extra) => {
    let values = [];
    let labels = [];
    data = !data ? [] : data;
    if (data.length > 0) {
        values = data.map((x) => x.value);
        labels = data.map((x) => x.name);
    }
    let avg = 0;
    if (values.length > 0) {
        avg = sum(values) / values.length;
        avg = avg < 100 ? true : false;
    }
    let option = {
        ...Color,
        title : {
            text: title,
            subtext: subtitle,
            left: 'center',
            top: '20px',
            ...TextStyle
        },
        grid: {
            top: "10%",
            left: "20%",
            show: true,
            label: {
                color: "#222",
                fontFamily: "Assistant",
            }
        },
        tooltip: {
            trigger: "item",
            formatter: "{b}: {c}",
            backgroundColor: "#ffffff",
            ...TextStyle
        },
        toolbox: {
            show: true,
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
        yAxis: {
            type: 'category',
            data: labels,
            axisLabel: {
                color: "#222",
                fontFamily: "Assistant",
            },
            axisTick: {
                alignWithLabel: true,
            }
        },
        xAxis: {
            type: 'value',
        },
        series: [
            {
                data: values,
                type: 'bar',
                label: {
                    formatter: function(params) {
                        return formatCurrency(params.data);
                    },
                    position: 'insideLeft',
                    show:true,
                    color: "#222",
                    fontFamily: "Assistant",
                    padding: 5,
                    borderRadius: avg ? 20 : 5,
                    backgroundColor: "#f2f2f2",
                }
            },
        ],
        color: ['#355c7d','#6c5b7b','#c06c84','#f67280','#f8b195','#ddd'],
        ...backgroundColor,
        ...Easing,
        ...extra
    };
    return option;
}

export default Bar;
