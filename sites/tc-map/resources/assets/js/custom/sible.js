const _ = require("lodash");

class Sible {
  constructor(data) {
    this.data = data;
  };

  popup(datapointid) {
    let data = this.data.features.find(x => x.properties.data_point_id == datapointid);
    let configs = JSON.parse(localStorage.getItem("configs"));
    let photos = [];
    let active = "active";
    _.mapKeys(data.properties, (val, key) => {
      if (typeof val === "string" && val.includes("https")) {
        let carousel = '\
          <div class="carousel-item '+active+' data-interval="10000">\
            <img src="'+val+'" class="d-block w-100" alt="photo">\
          </div>';
        photos.push(carousel);
        active = "";
      }
    });
    
    let val = data.properties;
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
        <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">Home</div>\
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

    $("#photo-temp").html(photos);

    return this.data;
  }
}

export default Sible;