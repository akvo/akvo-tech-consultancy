import { CountUp } from 'countup.js';
import { staticText, gradients, titleCase} from './util.js';
import { db, storeDB } from './dexie';
const echarts = window.echarts;
const axios = window.axios;
const table = db.charts;

const popupFormatter = (params) => {
    var value = (params.value + '').split('.');
    value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
    if (Number.isNaN(params.value)) {
        return;
    }
    return params.name + ': ' + value;
};

const mapOption = new Promise((resolve, reject) => {
    axios.get('/charts/home/map')
        .then(res => {
            resolve(res.data);
        })
        .catch(err => {
            reject(err);
        });
});

const generateCards = (info, color, rank) => {
    let rankhtml = (rank) => {
        if (rank !== "") {
            return "";
        }
        return rank;
    }
    let html = `<div class="col-md-3">
                    <div class="card card-cascade wider">
                        <div class="view view-cascade gradient-card-header ` + color + `-gradient">
                            <h5 class="card-header-title mb-3 mt-3 text-bold">` + rankhtml(rank) + `</h5>
                            <h5 class="card-header-title mb-3 mt-3 text-bold">` + info.country + `</h5>
                            <h3 class="card-header-title mb-3 mt-3" id="count-up-` + color + `">` + 0  + `</h3>
                            <p class="mb-3"><i class="fas fa-calendar mr-2"></i>` + info.project + ` - <strong>` + info.commodity + `</strong></p>
                        </div>
                    </div>
                </div>`
    $("#jumbotron").append(html);
    const countUp = new CountUp('count-up-' + color , info.value);
    if (!countUp.error) {
      countUp.start();
    } else {
      console.error(countUp.error);
    }
}

const fetchData = (endpoint) => {
    const split = endpoint.split('/');
    const filter = [split[1], split[2], split[3]].join('/');
    return new Promise((resolve, reject) => {
        axios.get('/charts/' + endpoint)
            .then(res => {
                console.log('fetch network', res);
                storeDB({
                    table : table,
                    data : {
                        endpoint: split[0],
                        filter: filter,
                        data: res.data
                    },
                    key : {
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

const loadData = async (endpoint) => {
    const split = endpoint.split('/');
    const filter = [split[1], split[2], split[3]].join('/');
    const res = await table.get({endpoint: split[0], filter: filter});
    if (res === undefined) {
        return fetchData(endpoint);
    }
    console.log('not fetch network', res);
    return res.data;
}

export const getCards = (cards) => {
    const topThree = loadData(cards);
    topThree.then(res => {
        res.forEach((data, index) =>  {
            let rank = '';
            if (rank !== 4) {
               rank = index;
            }
            generateCards(data, gradients[index], rank);
        });
        return true;
    });
}


export const getCharts = (chart, row, info, md, color) => {
    let chartname = chart.split("/")[1];
    let html = `<div class="col-md-` + md + `">
                <div class="card">
                  <div class="card-header gradient-card-header ` + color + `-gradient">` + titleCase(chartname) + `</div>
                  <div class="card-body">
                    <div class="d-flex justify-content-center" id="loader-` + chartname + `">
                      <div class="spinner-border text-primary loader-spinner" role="status">
                        <span class="sr-only">Loading...</span>
                      </div>
                    </div>
                    <div id="` + chartname + `" style="height:450px"></div>
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
}

export const getMaps = () => {
    var element = document.getElementById("maps");
    var myChart = echarts.init(element);
    axios.get('/json/africa.geojson')
        .then(res => {
            return res.data;
        })
        .then(africa => {
            echarts.registerMap('africa', africa);
            return true;
        })
        .then(echarts => {
            mapOption.then((response) => {
                let tooltip = {...response.tooltip,...{formatter: popupFormatter}};
                response = {
                    ...response,
                    ...{tooltip: tooltip}
                }
                console.log(response);
                myChart.setOption(response);
            })
            return true;
        });
    ;
}
