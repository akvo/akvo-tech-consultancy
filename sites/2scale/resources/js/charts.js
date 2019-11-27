const echarts = require('echarts');
const axios = require('axios');

const titleCase = (str) => {
    str = str.toLowerCase().split('-');
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
}

const getcharts = (chart, row, info, md) => {
    let html = `<div class="col-md-` + md + `">
                <div class="card">
                  <div class="card-header">` + titleCase(chart) + `</div>
                  <div class="card-body">
                    <div class="d-flex justify-content-center" id="loader-` + chart + `">
                      <div class="spinner-border text-primary loader-spinner" role="status">
                        <span class="sr-only">Loading...</span>
                      </div>
                    </div>
                    <div id="` + chart + `" style="height:450px"></div>
                  </div>
				  <div class="card-footer text-muted">` + info.content + `</div>
                </div>
                </div>`;
    $("#" + row).append(html);
    var element = document.getElementById(chart);
    var myChart = echarts.init(element);
    axios.get('/api/charts/' + chart)
        .then(res => {
            setTimeout(function() {
                $("#loader-" + chart).remove();
                myChart.setOption(res.data);
            }, 1000);
        })
}

const getCards = (info, color) => {
    let html = `<div class="col-md-3">
					<div class="card card-cascade wider">
						<div class="view view-cascade gradient-card-header ` + color + `">
							<h5 class="card-header-title mb-3 mt-3">` + info.head + `</h5>
							<p class="mb-3"><i class="fas fa-calendar mr-2"></i>26.07.2017</p>
						</div>
						<div class="card-body card-body-cascade text-center">
							<p class="card-text">` + info.content + `</p>
						</div>
					</div>
      			</div>`
    $("#jumbotron").append(html);
}

const getMaps = () => {
    var element = document.getElementById("maps");
    var myChart = echarts.init(element);
    axios.get('/json/africa.geojson').then(res => {
        console.log(res.data);
        echarts.registerMap('africa', res.data);
        option = {
            visualMap: {
                min: 800,
                max: 50000,
                text: ['High', 'Low'],
                realtime: false,
                calculable: true,
                inRange: {
                    color: ['lightskyblue', 'yellow', 'orangered']
                }
            },
            series: [{
                type: 'map',
                room: true,
                aspectScale: 1,
                map: 'africa',
                data: [{
                        name: 'Ghana',
						label: {show: true, fontSize: 5},
                        value: 20000
                    },
                    {
                        name: 'Niger',
						label: {show: true, fontSize: 5},
                        value: 9057
                    },
                    {
                        name: 'Ethiopia',
						label: {show: true, fontSize: 5},
                        value: 20057
                    },
                    {
                        name: 'Nigeria',
						label: {show: true, fontSize: 5},
                        value: 50057
                    },
                    {
                        name: "Côte d'Ivoire",
						label: {show: true, fontSize: 5},
                        value: 857
                    },
                    {
                        name: 'Mali',
						label: {show: true, fontSize: 5},
                        value: 1057
                    },
                    {
                        name: 'Burkina Faso',
						label: {show: true, fontSize: 5},
                        value: 20057
                    },
                    {
                        name: 'Kenya',
						label: {show: true, fontSize: 5},
                        value: 20000
                    },
                ],
                itemStyle: {
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 12
                        }
                    }
                },
                nameMap: {
                    'Nigeria': 'Nigeria',
                    'Burkina Faso': 'Burkina Faso',
                    'Uganda': 'Uganda',
                }
            }]
        };
        myChart.setOption(option);
    });
}

$("main").append("<div class='row' id='first-row'></div>");
const info = {
    head: "Header Lorem Ipsum",
    content: "Lorem Ipsum Dolor Sit Amet for Footer"
};
getcharts('workstream', 'first-row', info, "8");
getcharts('organisation-forms', 'first-row', info, "4");
getCards(info, 'purple-gradient');
getCards(info, 'peach-gradient');
getCards(info, 'blue-gradient');
getCards(info, 'morpheus-den-gradient');
getMaps();

// use configuration item and data specified to show chart
