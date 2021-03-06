import { Color, Easing, Legend, LegendReports, TextStyle, TextStyleReports, backgroundColor, Icons, dataView } from '../features/animation.js';
import sumBy from 'lodash/sumBy';
import {formatCurrency} from '../utils.js';

const Pie = (title, subtitle, props, data, extra, roseType=false, reports=false) => {
    data = !data ? [] : data;
    let total = {name:'total', value: 0};
    let labels = [];
    if (data.length > 0){
        data = data.map(x => {
            let n = x.name.split('(')[0];
            return {
                ...x,
                name: n
            }
        })
        data = reports
            ? data.filter(x => x.value !== 0)
            : data
        labels = data.map(x => x.name);
        total = {
            ...total,
            value: sumBy(data, 'value')
        }
    }
    let rose = {};
    if (roseType) {
        rose = {roseType: roseType}
    }
    if (sumBy(data,'value') === 0) {
        return {
            title : {
                text: title,
                subtext: "No Data",
                left: 'center',
                top: '20px',
                ...TextStyle
            },
        }
    }
    const text_style = reports ? TextStyleReports : TextStyle;
    const legend = reports ? LegendReports : Legend;
    let option = {
        ...Color,
        title: {
            text: reports ? (title + " (" + subtitle + ")" ) : title,
            subtext: reports ? "" : subtitle,
            right: 'center',
            top: reports ? 0 : '20px',
            ...text_style,
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
            backgroundColor: "#FFF",
        },
        series: [{
                name: title,
                type: "pie",
                right: reports ? "left" : "center",
                radius: reports ? ["40%", "70%"] : (roseType ? ["20%","70%"] : ["40%", "90%"]),
                label: {
                    normal: {
                        formatter: reports ? "{d}% ({c})" : "{d}%",
                        show: true,
                        position: roseType ? "outside" : "inner",
                        padding: reports ? 10 : 5,
                        borderRadius: 100,
                        backgroundColor: roseType ? 'rgba(0,0,0,.5)' : 'rgba(0,0,0,.3)',
                        textStyle: {
                            ...text_style.textStyle,
                            color: "#fff"
                        }
                    },
                    emphasis: {
                        fontSize: 12,
                        formatter: "{c} ({d} %)",
                        position: "center",
                        show: true,
                        backgroundColor: "#f2f2f2",
                        borderRadius:5,
                        padding:10,
                        ...text_style,
                    }
                },
                labelLine: {
                    normal: {
                        show: true
                    }
                },
                data: data,
                ...rose
            },{
                data: [total],
                type: "pie",
                right: reports ? "left" : "center",
                radius: reports ? ["0%", "30%"] : (roseType ? ["0%","20%"] : ["0%", "30%"]),
                label: {
                    normal: {
                        formatter: function(params) {
                            let values = params.data.value;
                            if (props.page.name === "funding") {
                                return props.locale.lang.total + "\n" + formatCurrency(values);
                            }
                            return props.locale.lang.total + "\n" + values;
                        },
                        show: true,
                        position: "center",
                        textStyle: {
                            ...text_style.textStyle,
                            fontSize: props.page.name === "funding" ? 12 : 16,
                            backgroundColor: props.page.name === "funding" ? "#f2f2f2" : "transparent",
                            padding: props.page.name === "funding" ? 5 : 0,
                            borderRadius: props.page.name === "funding" ? 5 : 0,
                            fontWeight: 'bold',
                            color: "#495057"
                        }
                    }
                },
                color: ["#f1f1f5"]
            }
        ],
        legend: {
            data: labels,
            ...legend,
        },
        ...Color,
        ...backgroundColor,
        ...Easing,
        ...extra
    };
    return option;
};

export default Pie;
