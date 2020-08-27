import { Easing, Color, TextStyle, TextStyleReports, backgroundColor, Icons, dataView } from '../features/animation.js';
import { formatCurrency } from '../utils.js';
import sum from 'lodash/sum';
import sortBy from 'lodash/sortBy';
import reverse from 'lodash/reverse';

const Bar = (title, subtitle, props, data, extra, reports=false) => {
    let values = [];
    let labels = [];
    data = !data ? [] : data;
    if (data.length > 0) {
        data = sortBy(data,'name');
        data = reverse(data);
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
            right: reports ? '40%' : 'center',
            top: reports ? '0px' : '20px',
            ...text_style
        },
        grid: {
            top: reports ? "50vh" : "15%",
            left: '20%',
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
            formatter: "{b}",
            padding:5,
            backgroundColor: "#f2f2f2",
            textStyle : {
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
        ...Color,
        ...backgroundColor,
        ...Easing,
        ...extra
    };
    return option;
}

export default Bar;
