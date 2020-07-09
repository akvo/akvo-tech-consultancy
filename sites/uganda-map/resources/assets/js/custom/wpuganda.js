const _ = require("lodash");

const myStylesheets = [
  // 'https://cdn.jsdelivr.net/npm/foundation-sites@6.6.3/dist/css/foundation.min.css', // foundation
  // 'https://cdn.jsdelivr.net/npm/bulma@0.9.0/css/bulma.min.css' // bulma
];

class WpUganda {
  constructor(data) {
    this.data = data;
    this.photos = [];
    this.configs = JSON.parse(localStorage.getItem("configs"));
    this.properties = {};
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

  generateData(contain) {
    let results = [];
    _.mapKeys(this.configs, (val, key) => {
      if (val.includes(contain)) {
        results.push({
          question: val,
          index: key,
          value: this.properties[key],
          // total: this.getSumAllData(key)
        });
      }
    });
    return results;
  };

  getSumAllData(key) {
    let properties = [];
    _.forEach(this.data.features, (x) => {
      properties.push(x.properties[key]);
    });    
    return _.reduce(properties, (a, b) => a + b);
  };

  createBarChart(title, data, x_axis, id) {
    let element = echarts.init(document.getElementById(id));
    let total = _.reduce(data, (a, b) => a['value'] + b['value']);
    let y_axis = _.map(data, (x) => x['value']);
    y_axis.push(total);

    let option = {
      title: {
        show: true,
        text: title
      },
      xAxis: {
          type: 'category',
          data: x_axis,
      },
      yAxis: {
          type: 'value'
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      series: [{
          data: y_axis,
          type: 'bar'
      }]
    };
    element.setOption(option);
    return;
  };

  popup(datapointid) {
    let data = this.data.features.find(x => x.properties.data_point_id == datapointid);
    console.log(data);
    this.properties = data.properties;

    // let schoolType = this.generateData("type of school");
    // let headTeacher = this.generateData("name of the head teacher");
    // let attendData = this.generateData("attend");
    // let teachers = this.generateData("teachers teach");
    // this.createCarousel(data.properties);

    // console.log('data', data);
    // console.log('config', this.configs);

    $(".modal-title").html(data.properties[this.configs.popup]);
    $(".modal-body").html(
      '\
       <h1>Hi</h1>\
      '
    );

    // $("#photo-temp").html(this.photos);

    // this.createBarChart("Students Attendace", attendData, ['Boy', 'Girl', 'All'], "student-attend");
    // this.createBarChart("Teachers", teachers, ['Female', 'Male', 'All'], "teachers-teach");

    return;
  };
}

export default WpUganda;