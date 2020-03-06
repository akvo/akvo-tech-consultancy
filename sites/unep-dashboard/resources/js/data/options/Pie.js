import { Easing } from '../features/animation.js';

const Pie = (data, title, calc) => {
    data = data.map((x) => {
        return {
            ...x,
            group: calc
        }
    });
    let labels = data.map(x => x.name);
    let option = {
        title: {
            text: title,
            left: "center",
            top: "top",
            textStyle: {
                color: "#222"
            }
        },
        tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            left: 'left',
            top: 'top',
            feature: {
                saveAsImage: {
                    type: 'jpg',
                    title: 'Save Image',
                    backgroundColor: '#ffffff'
                },
            }
        },
        legend: {
            orient: "horizontal",
            left: 10,
            bottom: 'bottom',
            data: labels
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
                        show: true,
                        textStyle: {
                            fontSize: "22",
                            fontWeight: "bold"
                        }
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
        ...Easing,
    };
    return option;
};

export default Pie;
