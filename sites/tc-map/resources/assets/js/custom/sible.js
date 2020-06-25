const _ = require("lodash");

class Sible {
  constructor(data) {
    this.data = data;
    this.photos = [];
    this.configs = JSON.parse(localStorage.getItem("configs"));
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

  getDataKey(data, contain) {
    let results = [];
    _.mapKeys(this.configs, (val, key) => {
      if (val.includes(contain)) {
        results.push({
          question: val,
          index: key,
          value: data[key],
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

  createBarChart(data, id) {
    let element = echarts.init(document.getElementById(id));
    let total = _.reduce(data, (a, b) => a['value'] + b['value']);
    let x_axis = _.map(data, (x) => x['question']);
    let y_axis = _.map(data, (x) => x['value']);
    
    x_axis.push('All');
    y_axis.push(total);

    let option = {
      xAxis: {
          type: 'category',
          data: ['Boy', 'Girl', 'All']
      },
      yAxis: {
          type: 'value'
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
    console.log(datapointid);

    let data = this.data.features.find(x => x.properties.data_point_id == datapointid);
    let attendData = this.getDataKey(data.properties, "attend")
    this.createCarousel(data.properties);

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
      <div class="tab-content" id="nav-tabContent">\
        <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">\
          <div class="row">\
            <div class="col-sm-6">\
              <h5>Students Attendance</h5>\
              <div id="student-attend" style="position: relative; overflow: hidden; width: 360px; height: 400px; padding: 0px; margin: 0px; border-width: 0px; cursor: default;"></div>\
            </div>\
            <div class="col-sm-6">\
              <div id="next-id"></div>\
            </div>\
          </div >\
        </div>\
        <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">Profile</div>\
        <div class="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">\
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
      </div>\
      '
    );

    $("#photo-temp").html(this.photos);

    this.createBarChart(attendData, "student-attend");

    return;
  };
}

export default Sible;