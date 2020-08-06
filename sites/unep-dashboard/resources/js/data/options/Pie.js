import { Color, Easing, Legend, TextStyle, backgroundColor, Icons } from '../features/animation.js';

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
            formatter: "{c} ({d}%)",
            backgroundColor: "#fff",
            ...TextStyle
        },
        toolbox: {
            show: true,
            orient: "horizontal",
            left: "right",
            top: "bottom",
            feature: {
                dataView: {
                    title: "View Data",
                    lang: ["Data View", "Turn Off", "Refresh"],
                    icon: Icons.dataView,
                    buttonColor: "#0478a9",
                    textAreaBorderColor: "#fff"
                },
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
                        fontSize: 16,
                        formatter: "{c} ({d} %)\n" + "{b}",
                        show: true,
                        backgroundColor: "#f2f2f2",
                        padding:10,
                        ...TextStyle
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
