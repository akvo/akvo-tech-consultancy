import { Color, Easing, Legend, TextStyle, backgroundColor, Icons, dataView } from '../features/animation.js';
import sumBy from 'lodash/sumBy';

const Pie = (title, subtitle, props, data, extra, roseType=false) => {
    data = !data ? [] : data;
    let labels = [];
    if (data.length > 0){
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
    let option = {
        ...Color,
        title: {
            text: title,
            subtext: subtitle,
            left: 'center',
            top: '20px',
            ...TextStyle,
        },
        tooltip: {
            trigger: "item",
            formatter: '{c} ({d}%)',
            backgroundColor: "#fff",
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
        series: [
            {
                name: title,
                type: "pie",
                radius: roseType ? ["20%","70%"] : ["50%", "70%"],
                label: {
                    normal: {
                        show: false,
                        position: "center"
                    },
                    emphasis: {
                        fontSize: 12,
                        formatter: "{b}\n" + "{c} ({d} %)",
                        show: true,
                        backgroundColor: "#f2f2f2",
                        borderRadius:5,
                        padding:10,
                        textStyle : {
                            ...TextStyle.textStyle,
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: data,
                ...rose
            }
        ],
        legend: {
            ...Legend,
            textStyle: {
                fontFamily: "Assistant",
                fontWeight: 'bold',
                fontSize: 12
            },
            data: labels,
        },
        color: ['#355c7d','#6c5b7b','#c06c84','#f67280','#f8b195','#ddd'],
        ...backgroundColor,
        ...Easing,
        ...extra
    };
    return option;
};

export default Pie;
