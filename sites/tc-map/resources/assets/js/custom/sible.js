const _ = require("lodash");

const myStylesheets = [
  // 'https://cdn.jsdelivr.net/npm/foundation-sites@6.6.3/dist/css/foundation.min.css', // foundation
  // 'https://cdn.jsdelivr.net/npm/bulma@0.9.0/css/bulma.min.css' // bulma
];

class Sible {
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
    this.properties = data.properties;

    let schoolType = this.generateData("type of school");
    let headTeacher = this.generateData("name of the head teacher");
    let attendData = this.generateData("attend");
    let teachers = this.generateData("teachers teach");
    this.createCarousel(data.properties);

    console.log('data', data);
    console.log('config', this.configs);

    $(".modal-title").html(data.properties[this.configs.popup]);
    $(".modal-body").html(
      '<nav>\
        <div class="nav nav-tabs" id="nav-tab" role="tablist">\
          <a class="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Home</a>\
          <a class="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">Profile</a>\
          <a class="nav-item nav-link" id="nav-contact-tab" data-toggle="tab" href="#nav-contact" role="tab" aria-controls="nav-contact" aria-selected="false">\
            <i class="fa fa-camera"></i>\
          </a>\
        </div>\
      </nav>\
      \
      <div class="tab-content" id="nav-tabContent">\
        <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">\
          <div>\
            <b>Type of School :</b>  '+ schoolType[0].value +'\
          </div>\
          <div>\
            <b>Head Teacher :</b>  '+ headTeacher[0].value +'\
          </div>\
          <hr>\
          <div class="row">\
            <div class="col-sm-6">\
              <div id="student-attend" style="position: relative; overflow: hidden; width: 360px; height: 400px; padding: 0px; margin: 0px; border-width: 0px; cursor: default;"></div>\
            </div>\
            <div class="col-sm-6">\
              <div id="teachers-teach" style="position: relative; overflow: hidden; width: 360px; height: 400px; padding: 0px; margin: 0px; border-width: 0px; cursor: default;"></div>\
            </div>\
          </div >\
        </div>\
      \
        <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">\
          \<div class="callout primary">\
            <h5>This is a callout.</h5>\
            <p>It has an easy to override visual style, and is appropriately subdued.</p>\
            <a href="#">It\'s dangerous to go alone, take this.</a>\
          </div>\
          \
        </div>\
      \
        <div div class= "tab-pane fade" id = "nav-contact" role = "tabpanel" aria - labelledby="nav-contact-tab" >\
          <div id="carouselExampleInterval" class="carousel slide" data-ride="carousel">\
            <div class="carousel-inner" id="photo-temp"></div>\
            <a class="carousel-control-prev" href="#carouselExampleInterval" role="button" data-slide="prev">\
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>\
              <span class="sr-only">Previous</span>\
            </a>\
            <a class="carousel-control-next" href="#carouselExampleInterval" role="button" data-slide="next">\
              <span class="carousel-control-next-icon" aria-hidden="true"></span>\
              <span class="sr-only">Next</span>\
            </a>\
          </div>\
        </div>\
      \
      </div>\
      '
    );

    $("#photo-temp").html(this.photos);

    this.createBarChart("Students Attendace", attendData, ['Boy', 'Girl', 'All'], "student-attend");
    this.createBarChart("Teachers", teachers, ['Female', 'Male', 'All'], "teachers-teach");

    return;
  };
}

export default Sible;