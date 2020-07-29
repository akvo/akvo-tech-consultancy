import {
    Color,
    Easing,
    Legend,
    TextStyle,
    backgroundColor,
    Icons
} from "../features/animation.js";

const TreeMap = (data, title, subtitle, extra) => {
    data = data.map(x => {
        return {
            ...x,
        };
    });
    let labels = data.map(x => x.name);
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
                avoidLabelOverlap: false,
                top: 100,
                itemStyle: {
                    normal: {
                        gapWidth: 2,
                        borderColor: "#eeeeee"
                    }
                },
                breadcrumb: {
                    show: false
                },
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
                            countries: {
                                fontFamily: TextStyle.fontFamily,
                                fontSize: 14,
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
                                lineHeight: 10
                            }
                        },
                        formatter: function(params) {
                            const arr = [
                                "{name|" + params.name + "}",
                                "{hr|}",
                                "{total|" + params.value + "} {label|counts}",
                                "{countries|" +
                                    params.data.countries +
                                    "} {label|countries}"
                            ];
                            return arr.join("\n");
                        },
                        position: "insideTopLeft"
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
        ...backgroundColor,
        ...Easing,
        ...extra
    };
    return option;
};

export default TreeMap;
