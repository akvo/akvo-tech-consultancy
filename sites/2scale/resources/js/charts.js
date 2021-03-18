import { CountUp } from "countup.js";
import { staticText, gradients, titleCase } from "./util.js";
import { db, storeDB } from "./dexie";
const echarts = window.echarts;
const axios = window.axios;
const table = db.charts;

const popupFormatter = params => {
    var value = (params.value + "").split(".");
    value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, "$1,");
    if (Number.isNaN(params.value)) {
        return;
    }
    return params.name + ": " + value;
};

const mapOption = endpoint => {
    return new Promise((resolve, reject) => {
        axios
            .get("/charts/" + endpoint)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err);
            });
    });
};

const generateCards = (info, color, rank) => {
    let rankhtml = rank => {
        if (rank !== "") {
            return "";
        }
        return rank;
    };
    if (info.project === undefined) {
        info.project = "";
    }
    if (info.commodity === undefined) {
        info.commodity = "";
    }
    let html =
        `<div class="col-md-3">
                    <div class="card card-cascade wider">
                        <div class="view view-cascade">
                            <h5 class="card-header-title mb-3 mt-3 text-bold">` +
        rankhtml(rank) +
        `</h5>
                            <h5 class="card-header-title mb-3 mt-3 text-bold">` +
        info.country +
        `</h5>
                            <h3 class="card-header-title mb-3 mt-3" id="count-up-` +
        color +
        `">` +
        0 +
        `</h3>
                            <p class="mb-3"><i class="fas fa-calendar mr-2"></i>` +
        info.project +
        ` - <strong>` +
        info.commodity +
        `</strong></p>
                        </div>
                    </div>
                </div>`;
    $("#jumbotron").append(html);
    const countUp = new CountUp("count-up-" + color, info.value);
    if (!countUp.error) {
        countUp.start();
    } else {
        console.error(countUp.error);
    }
};

const generateSingleCards = (info, color, id) => {
    let html =
        `<div class="col-md-12" id="` +
        id +
        `-value" dataTitle="` +
        info.title +
        `" dataValue="` +
        info.value +
        `">
                    <div class="card card-cascade wider">
                        <div class="text-center view view-cascade" style="color:white;">
                            <h5 class="card-header-title mb-3 mt-3 text-bold">` +
        info.title +
        `</h5>
                            <h3 class="card-header-title mb-3 mt-3" id="single-count-up-` +
        color +
        `">` +
        0 +
        `</h3>
                        </div>
                    </div>
                </div>`;
    $("#" + id).append(html);
    const countUp = new CountUp("single-count-up-" + color, info.value);
    if (!countUp.error) {
        countUp.start();
    } else {
        console.error(countUp.error);
    }
};

const fetchData = endpoint => {
    // console.log(endpoint);
    const split = endpoint.split("/");
    const filter = [split[1], split[2], split[3], split[4]].join("/");
    return new Promise((resolve, reject) => {
        axios
            .get("/charts/" + endpoint)
            .then(res => {
                storeDB({
                    table: table,
                    data: {
                        endpoint: split[0],
                        filter: filter,
                        data: res.data
                    },
                    key: {
                        endpoint: split[0],
                        filter: filter
                    }
                });
                resolve(res.data);
            })
            .catch(err => {
                reject(err);
            });
    });
};

const loadData = async endpoint => {
    const split = endpoint.split("/");
    const filter = [split[1], split[2], split[3], split[4]].join("/");
    const res = await table.get({ endpoint: split[0], filter: filter });
    if (res === undefined) {
        return fetchData(endpoint);
    }
    return res.data;
};

export const getCards = cards => {
    const topThree = loadData(cards);
    topThree.then(res => {
        res.forEach((data, index) => {
            let rank = "";
            if (rank !== 4) {
                rank = index;
            }
            generateCards(data, gradients[index], rank);
        });
        return true;
    });
};

export const getSingleCards = (cards, id) => {
    const single = loadData(cards);
    single.then(res => generateSingleCards(res, gradients[2], id));
};

export const getCharts = (chart, row, info, md, color, customTitle = null) => {
    let chartname = chart.split("/")[1];
    chartname = customTitle !== null ? customTitle : chartname;
    let html =
        `<div class="col-md-` +
        md +
        `">
                <div class="card">
                  <div class="card-header">` +
        titleCase(chartname) +
        `</div>
                  <div class="card-body">
                    <div class="d-flex justify-content-center" id="loader-` +
        chartname +
        `">
                      <div class="spinner-border text-primary loader-spinner" role="status">
                        <span class="sr-only">Loading...</span>
                      </div>
                    </div>
                    <div id="` +
        chartname +
        `" style="height:450px"></div>
                  </div>
                  <div class="card-footer text-muted"></div>
                </div>
                </div>`;
    $("#" + row).append(html);
    var element = document.getElementById(chartname);
    var myChart = echarts.init(element);
    loadData(chart)
        .then(res => {
            setTimeout(function() {
                $("#loader-" + chartname).remove();
                myChart.setOption(res);
            }, 1000);
        })
        .catch(e => {
            $("#loader-" + chartname).remove();
            myChart.setOption({
                title: { text: "No Data available for this request" }
            });
        });
};

export const getMaps = (id, endpoint) => {
    var element = document.getElementById(id);
    var myChart = echarts.init(element);
    axios
        .get("/json/africa.geojson")
        .then(res => {
            return res.data;
        })
        .then(africa => {
            echarts.registerMap("africa", africa);
            return true;
        })
        .then(echarts => {
            mapOption(endpoint).then(response => {
                let tooltip = {
                    ...response.tooltip,
                    ...{ formatter: popupFormatter }
                };
                response = {
                    ...response,
                    ...{ tooltip: tooltip }
                };
                myChart.setOption(response);
            });
            return true;
        });
};

export const getHierarchy = data => {
    var element = document.getElementById("hierarchy");
    var myChart = echarts.init(element);
    echarts.util.each(data.children, function(datum, index) {
        index % 2 === 0 && (datum.collapsed = true);
    });
    var option = {
        tooltip: {
            trigger: "item",
            triggerOn: "mousemove"
        },
        series: [
            {
                room: "zoom",
                zoom: true,
                type: "tree",

                data: [data],
                initialTreeDepth: 2,
                top: "1%",
                left: "7%",
                bottom: "1%",
                right: "20%",
                symbolSize: 8,
                itemStyle: {
                    borderWidth: 0
                },
                lineStyle: {
                    curveness: 0.3
                },
                symbolSize: function(params, name) {
                    if (name.data.value === "organisations") {
                        return 5;
                    }
                    if (name.data.value === "projects") {
                        return 7;
                    }
                    if (name.data.value === "partnership") {
                        return 10;
                    }
                    if (name.data.value === "countries") {
                        return 15;
                    }
                    return 12;
                },
                symbol: function(params, name) {
                    if (name.data.value === "organisations") {
                        return "rect";
                    }
                    if (name.data.value === "projects") {
                        return "circle";
                    }
                    if (name.data.value === "partnership") {
                        return "triangle";
                    }
                    if (name.data.value === "countries") {
                        return "roundRect";
                    }
                    return "diamond";
                },
                emphasis: {
                    label: {
                        backgroundColor: "#000",
                        color: "#fff",
                        padding: 5
                    },
                    lineStyle: {
                        width: 2
                    },
                    itemStyle: {
                        color: "#ff1744"
                    }
                },
                label: {
                    normal: {
                        position: "left",
                        verticalAlign: "middle",
                        align: "right",
                        fontSize: 12,
                        fontFamily: "Roboto"
                    }
                },
                leaves: {
                    label: {
                        normal: {
                            position: "right",
                            verticalAlign: "middle",
                            align: "left"
                        }
                    }
                },
                expandAndCollapse: true,
                animationDuration: 250,
                animationEasing: "backOut",
                animationDurationUpdate: 250
            }
        ]
    };
    myChart.setOption(option);
};
