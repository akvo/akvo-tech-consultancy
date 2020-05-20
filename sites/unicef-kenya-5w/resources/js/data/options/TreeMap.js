import {
    Color,
    Easing,
    Legend,
    TextStyle,
    backgroundColor,
    Icons
} from "../features/animation.js";

const getLevelOption = () => {
    return [
        {
            itemStyle: {
                borderWidth: 0,
                gapWidth: 5
            }
        },
        {
            itemStyle: {
                gapWidth: 1
            }
        },
        {
            colorSaturation: [0.35, 0.5],
            itemStyle: {
                gapWidth: 1,
                borderColorSaturation: 0.6
            }
        }
    ];
}

const TreeMap = (title, subtitle, list) => {
    let option = {
        ...Color,
        title: {
            text: title,
            subtext: subtitle,
            left: "center",
            top: "20px",
            ...TextStyle
        },
        tooltip: {
            trigger: "item",
            formatter: "{a} > {b} ({c})",
            backgroundColor: "#fff",
            ...TextStyle
        },
        toolbox: {
            show: true,
            orient: "horizontal",
            left: "right",
            top: "top",
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
                type: "treemap",
                top: 100,
                visibleMin:250,
                itemStyle: {
                    normal: {
                        gapWidth: 2,
                        borderColor: "rgba(37, 64, 97, .5)"
                    }
                },
                breadcrumb: {
                    show: false
                },
                levels: getLevelOption(list),
                label: {
                    normal: {
                        show: true,
                        rich: {
                            total: {
                                fontFamily: TextStyle.fontFamily,
                                fontSize: 22,
                                lineHeight: 30,
                                color: "#fff"
                            },
                            label: {
                                fontFamily: TextStyle.fontFamily,
                                fontSize: 9,
                                backgroundColor: "rgba(0,0,0,0.3)",
                                color: "#fff",
                                borderRadius: 2,
                                padding: [2, 4],
                                lineHeight: 25,
                                align: "right"
                            },
                            name: {
                                fontFamily: TextStyle.fontFamily,
                                fontSize: 12,
                                color: "#fff"
                            },
                            hr: {
                                fontFamily: TextStyle.fontFamily,
                                width: "100%",
                                borderColor: "rgba(255,255,255,0.2)",
                                borderWidth: 0.5,
                                height: 0,
                                lineHeight: 5
                            }
                        },
                        formatter: function(params) {
                            const arr = [
                                "{name|" + params.name + "}",
                                "{hr|}",
                            ];
                            return arr.join("\n");
                        },
                        position: "insideTopLeft"
                    }
                },
                height: "70%",
                upperLabel: {
                    normal : {
                        show: true,
                        height: 40,
                        padding: [2,4],
                        fontFamily: TextStyle.fontFamily,
                        fontSize: 12
                    },
                    formatter: function(params) {
                        return params.name + " [" + params.value + "]";
                    },
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: list
            }
        ],
        ...backgroundColor,
        ...Easing
    };
    return option;
};

export default TreeMap;
