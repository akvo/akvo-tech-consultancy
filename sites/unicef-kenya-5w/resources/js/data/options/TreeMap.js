import {
    Color,
    Easing,
    Legend,
    TextStyle,
    backgroundColor,
    Icons
} from "../features/animation.js";

const mapData = (name, path) => {
    return {
        value: 1,
        name: name,
        path: path + '/' + name
    }
}

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

const TreeMap = (data, subtitle, valtype, locations) => {
    let list = [
        {
            name: "Reporting Donors",
            path: "Donors",
            value: data.donors.length,
            children: data.donors.map(x => {
                return mapData(x, "Donors")
            })
        },
        {
            name: "Reporting Organisations",
            path: "Organisations",
            value: data.organisations.length,
            children: data.organisations.map(x => {
                return mapData(x, "Organisations")
            })
        },
        {
            name: "Implementing Partners",
            path: "Implementing",
            value: data.implementing.length,
            children: data.implementing.map(x => {
                return mapData(x, "Implementing")
            })
        },
        {
            name: "Counties",
            path: "Counties",
            value: data.locations.length,
            children: data.locations.map(x => {
                return mapData(x, "Counties")
            })
        }
    ];
    let option = {
        ...Color,
        title: {
            text: data.name,
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
                name: data.name,
                type: "treemap",
                top: 100,
                visibleMin:300,
                itemStyle: {
                    normal: {
                        gapWidth: 2,
                        borderColor: "rgba(0,0,0,0.5)"
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
                                lineHeight: 10
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
                upperLabel: {
                    show: true,
                    height: 30,
                    padding: [2,4]
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
