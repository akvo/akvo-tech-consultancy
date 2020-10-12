const _ = require("lodash");

class SigWashCovid {
    constructor(data) {
        this.data = data;
        this.photos = [];
        this.configs = JSON.parse(localStorage.getItem("configs"));
        this.properties = {};
    }

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

    popup(datapointid) {
        let data = this.data.features.find(x => x.properties.data_point_id == datapointid);
        this.properties = data.properties;
        this.createCarousel();

        // Location : L (Province | Area | Type | Name)
        let location = this.properties.L.split('|');
        console.log(location);

        $("#detail_modal .modal-title").html(this.properties[this.configs.popup]);
        $("#detail_modal .modal-body").html(
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

        $("#photo-temp").html(this.photos);
        return;
    };
}

export default SigWashCovid;