import { Easing, Color, TextStyle, TextStyleReports, backgroundColor, Icons, dataView } from '../features/animation.js';
import { formatCurrency } from '../utils.js';
import sum from 'lodash/sum';

const Bar = (title, subtitle, props, data, extra, reports=false) => {
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
    const text_style = reports ? TextStyleReports : TextStyle;
    let option = {
        ...Color,
        title : {
            text: reports ? (title + " (" + subtitle + ")" ) : title,
            subtext: reports ? "" : subtitle,
            left: 'center',
            top: reports ? '0px' : '20px',
            ...text_style
        },
        grid: {
            top: "15%",
            left: reports ? '30%' : '20%',
            show: true,
            label: {
                color: "#222",
                fontFamily: "Assistant",
                ...text_style
            }
        },
        tooltip: {
            show: reports ? false : true,
            trigger: "item",
            formatter: "{b}: {c}",
            backgroundColor: "#ffffff",
            ...text_style
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
        yAxis: {
            type: 'category',
            data: labels,
            axisLabel: {
                color: "#222",
                fontFamily: "Assistant",
                ...text_style
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
                    show: reports ? false : true,
                    color: "#222",
                    fontFamily: "Assistant",
                    padding: 5,
                    borderRadius: reports ? 5 : (avg ? 20 : 5),
                    backgroundColor: 'rgba(0,0,0,.3)',
                    textStyle: {
                        ...text_style.textStyle,
                        color: "#fff"
                    }
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
