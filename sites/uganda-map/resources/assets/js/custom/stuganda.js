import { thresholdScott } from "d3";

const _ = require("lodash");

const myStylesheets = [
  // 'https://cdn.jsdelivr.net/npm/foundation-sites@6.6.3/dist/css/foundation.min.css', // foundation
  // 'https://cdn.jsdelivr.net/npm/bulma@0.9.0/css/bulma.min.css' // bulma
];

class StUganda {
  constructor(data) {
    this.data = data;
    this.photos = [];
    this.configs = JSON.parse(localStorage.getItem("configs"));
    this.defColors = [];
    this.loadStyles(myStylesheets);
  };

  async loadStyles(stylesheets) {
    let arr = await Promise.all(stylesheets.map(url => fetch(url)))
    arr = await Promise.all(arr.map(url => url.text()))
    const style = document.createElement('style')
    style.textContent = arr.reduce((prev, fileContents) => prev + fileContents, '');
    document.head.appendChild(style);
    // Do whatever now
  };

  createCarousel(data) {
    let active = "active";
    _.filter(data, (val) => {
      if (typeof val === "string" && val.includes("https")) {
        let carousel = '\
          <div class="carousel-item '+active+' data-interval="10000">\
            <img src="'+val+'" class="d-block w-100" alt="photo">\
          </div>';
        this.photos.push(carousel);
        active = "";
      }
    });
    return;
  };

  createBarChart(data, id, attribution, filterIndex) {
    let element = echarts.init(document.getElementById(id));
    let prefix, suffix = "";
    let series = [];  //series
    let legends = [];
    let parishIndex = "J"
    let filter = _.filter(data, (x) => x.status === 'active'); //create only by active data
    let yAxis = _.uniq(_.map(filter, (x) => x[parishIndex].toUpperCase())); //parish

    if (attribution.type === "list") {
      prefix = "Count";
      legends = attribution.lookup;
      _.each(legends, (x, index) => {
        let res = _.filter(filter, (item) => item[filterIndex] .toLowerCase() === attribution.sources[index].toLowerCase());
        let colorIndex = _.findIndex(attribution.lookup, (z) => z.toLowerCase() === x.toLowerCase());
        let datas = _.map(yAxis, (y) => {
          let value = _.filter(res, (item) => item[parishIndex].toLowerCase() ===  y.toLowerCase());
          return {
            value: value.length,
            itemStyle: {color : attribution.color[colorIndex]}
          }
        });
        series.push({
          name: x,
          type: 'bar',
          stack: 1,
          label: {
              show: true,
              position: 'insideLeft'
          },
          data: datas
        });
      });
    }

    if (attribution.type === "num") {
      prefix = "Average";
      let datas = _.map(yAxis, (y) => {
        let value = _.map(filter, (item) => (item[parishIndex].toLowerCase() ===  y.toLowerCase()) ? item[filterIndex] : 0);
        let lvalue = _.filter(value, x => x !== 0);
        let sum = _.sum(lvalue);
        let avg = (sum > 0) ? sum/lvalue.length : 0;
        // console.log(y, value, sum, avg);
        return Math.round((avg + Number.EPSILON) * 100) / 100;
      });
      series.push({
        name: attribution.name,
        type: 'bar',
        stack: 1,
        label: {
            show: true,
            position: 'insideLeft'
        },
        data: datas
      });
    }

    suffix = " by Parish";
    let option = {
      title: {
          text: attribution.name,
          subtext: prefix + suffix,
          subtextStyle: {color: "black", fontSize: 13},
          left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {       
            type: 'shadow'
        }
      },
      legend: {
          orient: 'horizontal',
          top: 55,
          // left: 0,
          textStyle: {
            fontSize: 11,
          },
          data: legends,
      },
      grid: {
          top: '20%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      xAxis: {
          type: 'value'
      },
      yAxis: {
          type: 'category',
          data: yAxis
      },
      series: series
    };
    
    if (attribution.type === "list") {
      option["color"] = (attribution.color.length > 0) ? attribution.color : this.defColors.slice(0, attribution.lookup.length);
    }
    if (attribution.type === "num") {
      option["color"] = this.defColors.slice(0, 1);
    }
    element.setOption(option);
    return;
  };

  createPieChart(title, data, id, key) {
    let element = echarts.init(document.getElementById(id));
    let legends = [];
    let datas = [];
    let attribution = this.data.properties.fields[key];

    _.each(data, (val, key) => {
        let index = _.findIndex(attribution.lookup, (x) => x.toLowerCase() === key.toLowerCase());
        legends.push(key);
        datas.push({
          value: val.length, 
          name: key,
          itemStyle: {color: attribution.color[index]}
        });
    });

    let option = {
        title: {
            text: title,
            left: 'left'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'right',
            data: legends,
        },
        series: [
            {
                name: title,
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: datas,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                label: {
                    show: true,
                    position: 'outside',
                    formatter: '{b}\n{c} ({d}%)'
                }
            }
        ]
    };
    element.setOption(option);
    return;
  }

  generateData(data, index) {
    let filter = _.filter(data, (x) => x.status === 'active');
    let res = _.groupBy(filter, (x) => x[index]);
    return res;
  }

  popup(props, categoryField, defColors) {
    let attribution = this.data.properties.fields[categoryField];
    this.defColors = defColors;

    $('body').append(
        '<div id="geoshape-info" style="position: fixed; top: 75px; left: 10px; z-index: 1010; background: rgba(255, 255, 255, 0.8); border-radius: 5px; padding: 5px 10px; font-family: inherit; font-size: 14px;">\
            <div style="padding:5px" class="d-flex justify-content-between">\
              <h3>'+ props[this.configs.shapename.match] +'</h3>\
              <button style="display:none">Close</button>\
            </div>\
            <div id="chart-tmp"></div>\
        </div>'
    )
    
    if (props.data) {
        $('#chart-tmp').append('<div id="render-chart" style="position: relative; overflow: hidden; width: 700px; height: 500px; padding: 0px; margin: 0px; border-width: 0px; cursor: default;"></div>');
        // let sanitationType = this.generateData(props.data, "T");
        // this.createPieChart("Sanitation Type", sanitationType, "render-chart", "T");
        // let pieData = this.generateData(props.data, categoryField);
        // this.createPieChart(attribution.name, pieData, "render-chart", categoryField);
        this.createBarChart(props.data, "render-chart", attribution, categoryField);
    }
    return;
  };
}

export default StUganda;

/**
 * start from 0
#28a745
#dc3545
#FA0
#0288d1
#ab47bc
#40b1e6
#ffca29
#ab47bc
#28a745
 */