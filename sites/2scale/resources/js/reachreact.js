import { CountUp } from 'countup.js';
const echarts = require('echarts');
const axios = require('axios');
const gradients = ["purple","peach","blue","morpheus-den"];

const titleCase = (str) => {
    str = str.toLowerCase().split('-');
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
}

const getcharts = (chart, row, info, md) => {
    let chartname = chart.split("/")[1];
    let html = `<div class="col-md-` + md + `">
                <div class="card">
                  <div class="card-header">` + titleCase(chartname) + `</div>
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

const getCards = (info, color) => {
    let html = `<div class="col-md-3">
					<div class="card card-cascade wider">
						<div class="view view-cascade gradient-card-header ` + color + `-gradient">
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

$("main").append("<div class='row' id='first-row'></div>");

const info = {
    head: "Header Lorem Ipsum",
    content: "Lorem Ipsum Dolor Sit Amet for Footer"
};

getcharts('reachreact/gender', 'first-row', info, "12");
$("main").append("<hr><div class='row' id='second-row'></div>");
getcharts('reachreact/gender-total', 'second-row', info, "6");
getcharts('reachreact/country-total', 'second-row', info, "6");

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
        getCards(data, gradients[index]);
    });
    return true;
});
