import { Color, Easing, Legend, LegendReports, TextStyle, TextStyleReports, backgroundColor, Icons, dataView } from '../features/animation.js';
import sumBy from 'lodash/sumBy';

const Pie = (title, subtitle, props, data, extra, roseType=false, reports=false) => {
    data = !data ? [] : data;
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
            formatter: '{c} ({d}%)',
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
        series: [
            {
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
