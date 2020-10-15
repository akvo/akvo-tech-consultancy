const _ = require("lodash");

class SigWashCovid {
    constructor(data) {
        this.data = data;
        this.photos = [];
        this.configs = JSON.parse(localStorage.getItem("configs"));
        this.properties = {};
    }

    titleCase(string) {
      var sentence = string.toLowerCase().split(" ");
      for(var i = 0; i< sentence.length; i++){
         sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
      }
      return sentence.join(" ");
    };

    createCarousel() {
        let active = "active";
        _.filter(this.properties, (val) => {
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

    getLocation(locationBy) {
      let locationIndex;
      switch (locationBy) {
        case 'area':
          locationIndex = 1;
          break;
        case 'type':
          locationIndex = 2;
          break;
        case 'name':
          locationIndex = 3;
          break;
        default:
          locationIndex = 0;
          break;
      }
      return this.properties['L'].split('|')[locationIndex].toLowerCase();
    }

    calculateAvg(index, filterIndex, locationBy) {
      let location = this.getLocation(locationBy);
      let filterData = _.filter(this.data.features, x => x.properties[index].toLowerCase().includes(location));
      filterData = _.map(filterData, x => x.properties[filterIndex]);
      let sum = _.reduce(filterData, (sum, x) => sum + x);
      let avg = sum / filterData.length;
      return Math.round((avg + Number.EPSILON) * 100) / 100;
    };
  
    generateBarChartData(filterIndex) {
      let x_axis, y_axis = [];
      // x axis [name, province]
      x_axis = [
        this.titleCase(this.getLocation('name')), 
        // this.titleCase(this.getLocation('type')), 
        this.titleCase(this.getLocation('area')),
        this.titleCase(this.getLocation('province')),
      ];
      
      // y axis
      y_axis.push(this.properties[filterIndex]);
      // y_axis.push(this.calculateAvg("L", filterIndex, 'type'));
      y_axis.push(this.calculateAvg("L", filterIndex, 'area'));
      y_axis.push(this.calculateAvg("L", filterIndex, 'province'));
      return {x : x_axis, y: y_axis}
    };
  
    createBarChart(id, title, axis) {
      let element = echarts.init(document.getElementById(id));
      let option = {
        title: {
          show: true,
          text: title,
          textStyle: {
            fontSize: 16,
          },
        },
        xAxis: {
            type: 'category',
            data: axis.x,
        },
        yAxis: {
            type: 'value',
            axisLabel: {
              rotate: 45,
            },
        },
        tooltip: {
          show: true,
          trigger: 'axis'
        },
        series: [{
            data: axis.y,
            type: 'bar',
            label: {
              show: true,
            },
        }]
      };
      element.setOption(option);
      return;
    };

    popup(datapointid) {
        let data = this.data.features.find(x => x.properties.data_point_id == datapointid);
        this.properties = data.properties;
        this.createCarousel();

        // Location : L (Province | Area | Type | Name)
        let location = this.properties.L.split('|');

        $("#detail_modal .modal-title").html(this.properties[this.configs.popup]);
        $("#detail_modal .modal-body").html(
            '<nav>\
              <div class="nav nav-tabs" id="nav-tab" role="tablist">\
                <a class="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Profile</a>\
                <a class="nav-item nav-link" id="nav-comparisons-tab" data-toggle="tab" href="#nav-comparisons" role="tab" aria-controls="nav-comparisons" aria-selected="false">Comparisons</a>\
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
                    <b>Province</b> : '+location[0]+'\
                  </div>\
                  <div>\
                    <b>Area</b> : '+location[1]+'\
                  </div>\
                  <div>\
                    <b>Type</b> : '+location[2]+'\
                  </div>\
                  <div>\
                    <b>Name</b> : '+location[3]+'\
                  </div>\
                  <hr>\
                </div>\
              </div>\
            \
              <div class="tab-pane fade" id="nav-comparisons" role="tabpanel" aria-labelledby="nav-comparisons-tab">\
                <div class="row">\
                  <div class="col-sm-12">\
                    <div id="patient-visit-cart" style="position: relative; overflow: hidden; width: 720px; height: 400px; padding: 0px; margin: 0px; border-width: 0px; cursor: default;"></div>\
                  </div>\
                </div >\
                <hr>\
                <div class="row">\
                  <div class="col-sm-6">\
                    <div id="bed-total-cart" style="position: relative; overflow: hidden; width: 360px; height: 400px; padding: 0px; margin: 0px; border-width: 0px; cursor: default;"></div>\
                  </div>\
                  <div class="col-sm-6">\
                    <div id="staff-total-cart" style="position: relative; overflow: hidden; width: 360px; height: 400px; padding: 0px; margin: 0px; border-width: 0px; cursor: default;"></div>\
                  </div>\
                </div>\
                <hr>\
                <div class="row">\
                  <div class="col-sm-12">\
                    <div id="occupancy-cart" style="position: relative; overflow: hidden; width: 720px; height: 400px; padding: 0px; margin: 0px; border-width: 0px; cursor: default;"></div>\
                  </div>\
                </div >\
                <hr>\
                <div class="row">\
                  <div class="col-sm-6">\
                    <div id="water-demand-cart" style="position: relative; overflow: hidden; width: 360px; height: 400px; padding: 0px; margin: 0px; border-width: 0px; cursor: default;"></div>\
                  </div>\
                  <div class="col-sm-6">\
                    <div id="grey-water-cart" style="position: relative; overflow: hidden; width: 360px; height: 400px; padding: 0px; margin: 0px; border-width: 0px; cursor: default;"></div>\
                  </div>\
                </div >\
                <hr>\
                <div class="row">\
                  <div class="col-sm-6">\
                    <div id="black-water-cart" style="position: relative; overflow: hidden; width: 360px; height: 400px; padding: 0px; margin: 0px; border-width: 0px; cursor: default;"></div>\
                  </div>\
                  <div class="col-sm-6">\
                    <div id="fecal-matter-cart" style="position: relative; overflow: hidden; width: 360px; height: 400px; padding: 0px; margin: 0px; border-width: 0px; cursor: default;"></div>\
                  </div>\
                </div >\
              </div>\
            \
              <div div class="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab" >\
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
        
        // 281751020|What is the estimated number of patients visiting this facility in a typical day? : AF
        this.createBarChart("patient-visit-cart", "Number of patients visiting Facility Mean Comparisons", this.generateBarChartData("AF"));
        // 267650916|Total number of beds in the Health Care Facility : GI
        this.createBarChart("bed-total-cart", "Number of beds in Facility\nMean Comparisons", this.generateBarChartData("GI"));
        // 283700916|Total number of staff : GJ
        this.createBarChart("staff-total-cart", "Number of staff in Facility\nMean Comparisons", this.generateBarChartData("GJ"));        
        // 279790917|Calculate the Occupancy Rate %: (Number of beds occupied at the moment) divided by (total number of beds in the facility), multiplied by 100 : GK
        this.createBarChart("occupancy-cart", "Occupancy Rate (%) in Facility Mean Comparisons", this.generateBarChartData("GK"));
        // 289820918|Calculate the water demand in liters: (Number of patients and staff at the moment) multiplied by 150 : GL
        this.createBarChart("water-demand-cart", "Water demand (liters) in Facility\nMean Comparisons", this.generateBarChartData("GL"));        
        // 259820916|Calculate the expected grey water: Take the answer from question 4 and multiply it by .8 : GM
        this.createBarChart("grey-water-cart", "Expected grey water in Facility\nMean Comparisons", this.generateBarChartData("GM"));        
        // 285760916|Calculate the expected black water: Take the answer from question 4 and multiply it by .2 : GN
        this.createBarChart("black-water-cart", "Expected black water in Facility\nMean Comparisons", this.generateBarChartData("GN"));        
        // 263740916|Calculate the expected liters of fecal matter in black water per day: (Number of patients and staff at the moment) multiplied by .5 : GO
        this.createBarChart("fecal-matter-cart", "Expected fecal mater in black water per day\nMean Comparisons", this.generateBarChartData("GO"));        

        $("#photo-temp").html(this.photos);
        return;
    };
}

export default SigWashCovid;