import {
    insert,
    titleCase
} from './util.js';
import {
    newContainer,
    defaultColors,
    admLevel,
} from './util.js';
const echarts = require('echarts');
const L = require('leaflet');
const _ = require('lodash');

const getMaps = (id, figure, data) => {
    const latIndex = data.names.indexOf(figure.points[0]);
    const lngIndex = data.names.indexOf(figure.points[1]);
    const indicator = data.names.indexOf(figure.category);
    const container = L.DomUtil.get(id);
    if(container != null){
      container._leaflet_id = null;
    }

    const map = L.map(id).setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    let categories = _(data.values).map((d) => {
        return d[indicator];
    }).value();
    categories = _(categories).uniq().value();

    var legend = L.control({position: 'topright'});
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        for (let i = 0; i < categories.length; i++) {
            let legendColor = defaultColors[i];
            let categoryName = categories[i];
            if(!isNaN(categoryName)) {
                categoryName = categoryName === 0 ? "No / Empty / 0" : "Yes / 1";
            }
            if (figure.colors) {
                legendColor = figure.colors[categories[i]];
            }
            div.innerHTML +=
            `<div class='legend-block'>
                <div class="legend-icons" style="background:` + legendColor + `">
                </div><span class="legend-text">` + titleCase(categoryName) + `</span></div>`;
        }
        return div;
    };
    legend.addTo(map)

    const constantZoom = map.getZoom();

    var markers = _(data.values).map((d) => {
        let catIndex = categories.indexOf(d[indicator]);
        let color = defaultColors[catIndex];
        if (figure.colors) {
            color = figure.colors[catIndex];
        }
        let radius = 1200 / figure.width;
        const markerIcon = {
            points: true,
            adm: {
                district: d[admLevel.district],
                village: d[admLevel.village]
            },
            opacity: 1,
            color: 'white',
            fillColor: color,
            fillOpacity: 1,
            weight: 1,
            radius: radius
        };
        const markerLayer = L.circle([d[latIndex], d[lngIndex]], markerIcon).addTo(map);
        return markerLayer;
    }).value();

    var bounds = _(data.values).map((d) => {
        return [d[latIndex], d[lngIndex]];
    }).value();
    bounds = _(bounds).compact().value();
    map.fitBounds(bounds);

    var myZoom = {
        start: map.getZoom(),
        end: map.getZoom()
    };

    map.on('zoomend', function(e) {
        let currentZoom = map.getZoom();
        let zoomIn = currentZoom > constantZoom ? true : false;
        let radius = 1200 / figure.width;
        if (zoomIn) {
            let zoomDiff  = currentZoom - constantZoom + 1;
            radius = radius / zoomDiff;
        }
        _(markers).forEach((circle) => {
            circle.setRadius(radius);
        });
    });

    $("#loading-" + id).remove();
    map.figure = figure;
    map.scrollWheelZoom.disable();
    return map;
}

export const initChart = (figure, data) => {
    newContainer(figure.position);
    let id = figure.title.split(" ")[0].replace(/\./g, '');
    let html = `<div class="col-md-` + figure.width + `">
              <div class="card">
                <div class="card-header gradient-card-header">` + titleCase(figure.title) + `</div>
                <div class="card-body">
                    <div class="loading-frame" id="loading-` + id + `" >
                    <div class="spinner-border text-primary">
                    </div>
                    </div>
                  <div id="` + id + `" style="height:450px"></div>
                </div>
                <div class="card-footer text-muted">` + figure.content + `</div>
              </div>
              </div>`;
    $("#" + figure.position).append(html);

    let isMap = figure.type === 'map' ? true : false;

    if (!isMap) {
        var element = document.getElementById(id);
        var myChart = echarts.init(element);
        myChart.figure = figure;
    }

    if (figure.type === 'bar') {
        let indexLegend = data.names.indexOf(figure.legend);
        let indexX = data.names.indexOf(figure.x);
        let legend = _(data.values).map(x => x[indexLegend]).uniq().value();
        let xAxis = _(data.values).map(x => x[indexX]).uniq().value();
        let sums = _(data.values).countBy(indexX).value();

        let series = _(data.values).groupBy(indexLegend).map((items, val) => {
            let values = _(items).countBy(indexX).value();
            let dataSeries = _(xAxis).map(x => {
                let defVal = values[x] == undefined ? null : values[x];
                if (defVal === null || defVal === 0) {
                    return null;
                }
                return ((defVal * 100) / sums[x]).toFixed(0);
            }).value();

            return {
                name: val,
                type: 'bar',
                stack: "total",
                zLevel: 3,
                label: {
                    normal: {
                        fontSize: 14,
                        show: true,
                        position: "inside",
                        formatter: "{c}%"
                    }
                },
                data: dataSeries
            }
        }).value();

        myChart.setOption({
            tooltip: {},
            legend: {
                data: legend
            },
            xAxis: {
                data: _.map(xAxis, x => insert(x, 10, "\n")),
                axisLabel: {
                    rotate: 305
                }
            },
            yAxis: {},
            series
        });

        if (id !== null) {
          $("#loading-" + id).remove();
        }

        return myChart;
    }

    if (figure.type === 'pie') {
        let indexLegend = data.names.indexOf(figure.legend);
        let legend = _(data.values).map(x => x[indexLegend]).uniq().value();
        let chartData = _(data.values).countBy(indexLegend).value();
        let series = _(legend).map(x => {
            return {
                value: chartData[x],
                name: x
            };
        }).value();

        myChart.setOption({
            tooltip: {},
            legend: {
                data: legend
            },
            series: {
                type: 'pie',
                radius: ['70%', '30%'],
                center: ['50%', '50%'],
                zLevel: 3,
                label: {
                    normal: {
                        fontSize: 14,
                        show: true,
                        position: "inside",
                        formatter: "{d}%\n({c})"
                    }
                },
                data: series
            }
        });
        $("#loading-" + id).remove();
        return myChart;
    }

    return getMaps(id, figure, data);
}

export const updateChart = (chart, data, district, village) => {
  let figure = chart.figure;
  if (figure.type === 'bar') {
    let indexLegend = data.names.indexOf(figure.legend);
    let indexX = data.names.indexOf(figure['x']);
    let legend = _(data.values).map(x => x[indexLegend]).uniq().value();
    let xAxis = _(data.values).map(x => x[indexX]).uniq().value();
    let sums = _(data.values).countBy(indexX).value();

    let series = _(data.values).groupBy(indexLegend).map((items, val) => {
        let values = _(items).countBy(indexX).value();
        let dataSeries = _(xAxis).map(x => {
            let defVal = values[x] == undefined ? null : values[x];
            if (defVal === null || defVal === 0) {
                return null;
            }
            return ((defVal * 100) / sums[x]).toFixed(0);
        }).value();

        return {
          name: val,
          type: 'bar',
          stack: "total",
          zLevel: 3,
          label: {
              normal: {
                  fontSize: 14,
                  show: true,
                  position: "inside",
                  formatter: "{c}%"
              }
          },
          data: dataSeries
      }
    }).value();

    chart.setOption({
        tooltip: {},
        legend: { data: legend },
        xAxis: {
            data: _.map(xAxis, x => insert(x, 10, "\n")),
            axisLabel: {
                rotate: 305
            }
        },
        yAxis: {},
        series
    });

    return null;
  }

  if (figure.type === 'pie') {
    let indexLegend = data.names.indexOf(figure.legend);
    let legend = _(data.values).map(x => x[indexLegend]).uniq().value();
    let chartData = _(data.values).countBy(indexLegend).value();
    let series = _(legend).map(x => {
      return {
        value: chartData[x],
        name: x
      };
    }).value();

    chart.setOption({
        tooltip: {},
        legend: { data: legend },
        series: {
          type: 'pie',
          radius: ['70%', '30%'],
          center: ['50%', '50%'],
          zLevel: 3,
          label: {
              normal: {
                  fontSize: 14,
                  show: true,
                  position: "inside",
                  formatter: "{d}%\n({c})"
              }
          },
          data: series
        }
    });

    return null;
  }

  let id = figure.title.split(" ")[0].replace(/\./g, '');
  let hideMarker = {fillOpacity: 0, opacity:0};
  let showMarker = {fillOpacity: 1, opacity:1};
  chart.eachLayer((layer) => {
      let isMarker = false;
      if(layer.options.points){
          isMarker = true;
      };
      if(isMarker) {
          layer.setStyle({
              ...layer.options,
              ...showMarker,
          });
          if (layer.options.adm.district !== district && village !== 'Location Gram Panchayat') {
              layer.setStyle({
                  ...layer.options,
                  ...hideMarker,
              });
          }
          if (layer.options.adm.district !== village && village !== 'Location Village') {
              layer.setStyle({
                  ...layer.options,
                  ...hideMarker,
              });
          }
      }
  });
  //getMaps(id, figure, data);
  return null;
}

