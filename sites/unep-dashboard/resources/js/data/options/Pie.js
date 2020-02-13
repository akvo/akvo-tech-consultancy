import { Easing } from '../features/animation.js';

const Pie = (data, title) => {
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
        legend: {
            orient: "vertical",
            left: 10,
            top: 70,
            data: labels
        },
        series: [
            {
                name: title,
                type: "pie",
                top: 120,
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
