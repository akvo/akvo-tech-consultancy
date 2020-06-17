import { Color, Easing, Legend, TextStyle, backgroundColor, Icons } from '../features/animation.js';

const Pie = (data, title, subtitle, valtype, calc) => {
    data = data.map((x) => {
        return {
            ...x,
            group: calc
        }
    });
    let labels = data.map(x => x.name);
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
            orient: 'horizontal',
            left: 'right',
            top: 'top',
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
        },
        series: [
            {
                name: title,
                type: "pie",
                radius: ["40%", "70%"],
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
                data: data
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
