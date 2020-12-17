import { legend } from 'echarts/lib/theme/dark';
import { Color, Easing, Legend, TextStyle, backgroundColor, Icons } from '../features/animation.js';
import { textWordWrap } from '../utils';

const Pie = (data, title, subtitle, valtype, calc, rose=false) => {
    data = data.map((x) => {
        return {
            ...x,
            name: textWordWrap(x.name),
            group: calc
        }
    });
    let labels = data.map(x => x.name);
    let roseType = (rose) ? {roseType: 'area'} : "";
    let radius = (rose) ? {radius: ["20%", "60%"]} : {radius: ["40%", "70%"]};
    let legend = (!rose) 
                    ? {legend: {
                        ...Legend,
                        data: labels,
                    }} : "";
    let toolboxFeatures = (!rose) 
                            ? {
                                feature: {
                                    dataView: {
                                        title: 'View Data',
                                        lang: ['Data View', 'Turn Off', 'Refresh'],
                                        icon: Icons.dataView,
                                        buttonColor: '#0478a9', textAreaBorderColor: '#fff',
                    
                                    },
                                    saveAsImage: {
                                        type: 'jpg',
                                        title: 'Save Image',
                                        icon: Icons.saveAsImage,
                                        backgroundColor: '#ffffff'
                                    },
                                },
                            } : "";
    let seriesLabel = (!rose)
                        ? {
                            label: {
                                normal: {
                                    show: false,
                                    position: "center"
                                },
                                emphasis: {
                                    formatter: "{b}",
                                    show: true,
                                    ...TextStyle
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            }
                        } : "";

    let option = {
        ...Color,
        title: {
            text: textWordWrap(title),
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
            orient: 'horizontal',
            left: 'right',
            top: 'top',
            ...toolboxFeatures
        },
        series: [
            {
                name: title,
                type: "pie",
                avoidLabelOverlap: false,
                data: data,
                ...radius,
                ...seriesLabel,
                ...roseType
            }
        ],
        ...legend,
        ...backgroundColor,
        ...Easing,
    };
    return option;
};

export default Pie;
