import { CountUp } from 'countup.js';
const echarts = require('echarts');
const axios = require('axios');
const gradients = ["purple","peach","blue","morpheus-den"];

const staticText = require("../json/static.json");
console.log(staticText);

const titleCase = (str) => {
    str = str.toLowerCase().split('-');
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
}

const getcharts = (chart, row, info, md, color) => {
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
				  <div class="card-footer text-muted">` + info.content + `</div>
                </div>
                </div>`;
    $("#" + row).append(html);
    var element = document.getElementById(chartname);
    var myChart = echarts.init(element);
    axios.get('/api/charts/' + chart)
        .then(res => {
            setTimeout(function() {
                $("#loader-" + chartname).remove();
                myChart.setOption(res.data);
            }, 1000);
        })
}

const getCards = (info, color, rank) => {
    let rankhtml = (rank) => {
        if (rank !== "") {
            return "";
        }
        return rank;
    }
    let html = `<div class="col-md-3">
					<div class="card card-cascade wider">
						<div class="view view-cascade gradient-card-header ` + color + `-gradient">
                            <h5 class="card-header-title mb-3 mt-3 text-bold">` + rank + `</h5>
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

const popupFormatter = (params) => {
    var value = (params.value + '').split('.');
    value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
    if (Number.isNaN(params.value)) {
        return;
    }
    return params.name + ': ' + value;
};

const mapOption = new Promise((resolve, reject) => {
    axios.get('/api/charts/home/map')
        .then(res => {
            resolve(res.data);
        })
        .catch(err => {
            reject(err);
        });
});

const getMaps = () => {
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

getMaps();

$("main").append("<div class='row' id='first-row'></div>");

const info = {
    head: "Header Lorem Ipsum",
    content: "Lorem Ipsum Dolor Sit Amet for Footer"
};

getcharts('rnr/country-total', 'zero-row', info, "6", "purple");
getcharts('home/workstream', 'first-row', info, "7", "blue");
getcharts('home/organisation-forms', 'first-row', info, "5", "morpheus-den");

const topThree = new Promise((resolve, reject) => {
    axios.get('/api/charts/home/top-three')
        .then(res => {
            resolve(res.data);
        })
        .catch(err => {
            reject(err);
        });
});

topThree.then(res => {
    res.forEach((data, index) =>  {
        let rank = '';
        if (rank !== 4) {
           rank = index;
        }
        getCards(data, gradients[index], rank);
    });
    return true;
});
