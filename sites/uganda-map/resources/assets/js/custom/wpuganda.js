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

  titleCase(string) {
    var sentence = string.toLowerCase().split(" ");
    for(var i = 0; i< sentence.length; i++){
       sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    return sentence.join(" ");
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

  calculateAvg(index, filterIndex) {
    let filterData = _.filter(this.data.features, x => x.properties[index].toLowerCase() === this.properties[index].toLowerCase());
    filterData = _.map(filterData, x => x.properties[filterIndex]);
    let sum = _.reduce(filterData, (sum, x) => sum + x);
    let avg = sum / filterData.length;
    return Math.round((avg + Number.EPSILON) * 100) / 100;
  };

  generateHouseholdsData(filterIndex) {
    let x_axis, y_axis = [];
    // x axis
    x_axis = [this.titleCase(this.properties.G), "Parish", "Sub County"];
    
    // y axis
    y_axis.push(this.properties[filterIndex]);
    y_axis.push(this.calculateAvg("F", filterIndex));
    y_axis.push(this.calculateAvg("E", filterIndex));
    return {x : x_axis, y: y_axis}
  };

  createBarChart(id, title, axis) {
    let element = echarts.init(document.getElementById(id));
    let option = {
      title: {
        show: true,
        text: title,
      },
      xAxis: {
          type: 'category',
          data: axis.x,
      },
      yAxis: {
          type: 'value'
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      series: [{
          data: axis.y,
          type: 'bar'
      }]
    };
    element.setOption(option);
    return;
  };

  popup(datapointid) {
    let data = this.data.features.find(x => x.properties.data_point_id == datapointid);
    this.properties = data.properties;
    this.createCarousel(data.properties);

    // village: G
    // parish: F
    // sub county: E

    console.log(data.properties[this.configs.popup]);
    
    $(".modal-title").html(data.properties[this.configs.popup]);
    $(".modal-body").html(
      '<nav>\
        <div class="nav nav-tabs" id="nav-tab" role="tablist">\
          <a class="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Profile</a>\
          <a class="nav-item nav-link" id="nav-contact-tab" data-toggle="tab" href="#nav-contact" role="tab" aria-controls="nav-contact" aria-selected="false">\
            <i class="fa fa-camera"></i>\
          </a>\
        </div>\
      </nav>\
      \
      <div class="tab-content" id="nav-tabContent">\
        <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">\
          <div id="basic-info">\
            <div>\
              <b>Village</b> : '+this.titleCase(data.properties.G)+'\
            </div>\
            <div>\
              <b>Parish</b> : '+this.titleCase(data.properties.F)+'\
            </div>\
            <div>\
              <b>Sub County</b> : '+this.titleCase(data.properties.E)+'\
            </div>\
            <hr>\
          </div>\
          <div class="row">\
            <div class="col-sm-12">\
              <div id="households-cart" style="position: relative; overflow: hidden; width: 720px; height: 400px; padding: 0px; margin: 0px; border-width: 0px; cursor: default;"></div>\
            </div>\
          </div >\
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
    
    // create households number chart
    this.createBarChart("households-cart", "Number of Households using this Facility Mean Comparisons", this.generateHouseholdsData("DX"));
    // eol households cart

    // append basic information
    this.data.properties.attributes.forEach(x => {
      $("#basic-info").append('\
        <div>\
          <b>'+x.name+' :</b>  '+data.properties[x.id]+'\
        </div>\
        <hr>\
      ');
    });
    // eol basic information

    $("#photo-temp").html(this.photos);
    return;
  };
}

export default WpUganda;