import { titleCase } from './util.js';
import { getOptions } from './data.js';
const echarts = require('echarts');
const L = require('leaflet');
const _ = require('lodash');

export const getCharts = (title, row, info, md, color) => {
    let id = title.split(" ")[0];
    let html = `<div class="col-md-` + md + `">
                <div class="card">
                  <div class="card-header gradient-card-header ` + color + `-gradient">` + titleCase(title) + `</div>
                  <div class="card-body">
                    <div id="` + id + `" style="height:450px"></div>
                  </div>
                  <div class="card-footer text-muted">` + info.content + `</div>
                </div>
                </div>`;
    $("#" + row).append(html);
    var element = document.getElementById(id);
    var myChart = echarts.init(element);
    var option = getOptions(info.type, id);
    myChart.setOption(option);
    return myChart;
}

export const getMaps = (title, row, info, md, color) => {
    let id = title.split(" ")[0];
    let html = `<div class="col-md-` + md + `">
                <div class="card">
                  <div class="card-header gradient-card-header ` + color + `-gradient">` + titleCase(title) + `</div>
                  <div class="card-body">
                    <div id="` + id + `" style="height:450px"></div>
                  </div>
                  <div class="card-footer text-muted">` + info.content + `</div>
                </div>
                </div>`;
    $("#" + row).append(html);
    var option = getOptions(info.type, id);
    const mymap = L.map(id, { maxZoom: option.maxZoom }).setView([option.lat, option.lng], 15);
    mymap.scrollWheelZoom.disable();
    const tileServer = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tileAttribution = 'Tiles © Wikimedia — Source: OpenStreetMap, Data: Akvolumen';
    L.tileLayer(tileServer, {
        attribution: tileAttribution,
    }).addTo(mymap);
}

export const initChart = (figure, data) => {
  let id = figure['title'].split(" ")[0];
  let html = `<div class="col-md-` + figure['width'] + `">
              <div class="card">
                <div class="card-header gradient-card-header">` + titleCase(figure['title']) + `</div>
                <div class="card-body">
                  <div id="` + id + `" style="height:450px"></div>
                </div>
                <div class="card-footer text-muted">` + figure['content'] + `</div>
              </div>
              </div>`;
  $("#" + figure['position']).append(html);
  var element = document.getElementById(id);
  var myChart = echarts.init(element);
  myChart['figure'] = figure;
  
  let legend = _(data).map(x => x[figure['legend']] ).uniq().value();
  let xAxis = _(data).map(x => x[figure['x']] ).uniq().value();
  let sums = _(data).countBy(figure['x']).value();

  let series = _(data).groupBy(figure['legend']).map((items, val) => {
      let values = _(items).countBy(figure['x']).value();
      let dataSeries = _(xAxis).map(x => {
          let defVal = values[x] == undefined ? 0 : values[x];
          return Math.round((defVal * 100) / sums[x]);
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
      legend: { data: legend },
      xAxis: {
          data: xAxis,
          axisLabel: {
              rotate: 305
          } 
      },
      yAxis: {},
      series
  });

  return myChart;
}

export const updateChart = (chart, data) => {
  let figure = chart['figure'];
  let legend = _(data).map(x => x[figure['legend']] ).uniq().value();
  let xAxis = _(data).map(x => x[figure['x']] ).uniq().value();
  let sums = _(data).countBy(figure['x']).value();

  let series = _(data).groupBy(figure['legend']).map((items, val) => {
      let values = _(items).countBy(figure['x']).value();
      let dataSeries = _(xAxis).map(x => {
          let defVal = values[x] == undefined ? 0 : values[x];
          return Math.round((defVal * 100) / sums[x]);
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
          data: xAxis,
          axisLabel: {
              rotate: 305
          } 
      },
      yAxis: {},
      series
  });
}