import { Easing, Color, TextStyle, backgroundColor, Icons, dataView } from '../features/animation.js';
import { formatCurrency } from '../utils.js';
import sum from 'lodash/sum';

const BarStack = (title, subtitle, props, data, extra) => {
    if (!data) {
        return {
            title: {
                text: "No Data",
                subtext: "",
                left: 'center',
                top: '20px',
                ...TextStyle
            }
        };
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
        legend: {
            data: data.legends,
            icon: 'circle',
            top: '0px',
            left:'center',
            align: 'auto',
            orient: 'horizontal',
            textStyle: {
                fontFamily: "Assistant",
                fontWeight: 'bold',
                fontSize: 12
            },
        },
        grid: {
            top: "23px",
            left: "auto",
            right: "auto",
            bottom: "25px",
            borderColor: "#ddd",
            borderWidth: .5,
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
        toolbox: {show: false},
        yAxis: [{
            type: 'value',
            axisLabel: {
                inside: true,
                backgroundColor: '#f2f2f2',
                padding: 5,
                fontFamily: "Assistant",
                fontSize: 12
            },
            axisLine: {show:false}
        }],
        xAxis: data.xAxis.map(x => {
            return {
                ...x,
                type: 'category',
                axisLine: {
                    lineStyle:{
                        color: '#ddd',
                    }
                },
                axisLabel: {
                    fontFamily: "Assistant",
                    fontSize: 12,
                    color: '#222'
                },
            }
        }),
        series: data.series,
        color: ['#6c5b7b','#c06c84','#f67280','#f8b195','#F59C2F','#845435','#226E7B','#2C201F'],
        ...backgroundColor,
        ...Easing,
        ...extra
    };
    console.log(option);
    return option;
}

export default BarStack;
