import { Color, Easing, Legend, TextStyle, backgroundColor, Icons } from '../features/animation.js';
import { textWordWrap } from '../utils';

const Pie = (data, title, subtitle, valtype, calc, rose=false) => {
    data = data.map((x) => {
        return {
            ...x,
            group: calc
        }
    });
    let labels = data.map(x => x.name);
    let roseType = (rose) ? {roseType: 'area'} : "";
    let radius = (rose) ? {radius: ["25%", "70%"]} : {radius: ["40%", "70%"]};
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
                            } : ""
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
                ...radius,
                avoidLabelOverlap: false,
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
                },
                data: data,
                ...roseType
            }
        ],
        legend: {
            ...Legend,
            data: labels,
        },
        ...backgroundColor,
        ...Easing,
    };
    return option;
};

export default Pie;
