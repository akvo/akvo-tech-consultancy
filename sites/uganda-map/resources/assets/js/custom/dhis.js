const _ = require('lodash');

class Dhis {
  constructor(data) {
    this.data = data;
  };

  popup(datapointid) {
    console.log('dhis', this.data.features);
    let data = this.data.features.find(x => x.properties.data_point_id == datapointid);
    let configs = JSON.parse(localStorage.getItem('configs'));
    
    let val = data.properties;
    $(".modal-body").html(
      "\
        <div class='container'>\
          <h3>\
            Patient "+val.D+"\
            <small class='text-muted'>"+new Date(val.A).toDateString()+"</small>\
          </h3>\
          <dl class='row'>\
            <dt class='col-sm-3'>Gender:</dt>\
            <dd class='col-sm-9'>"+val.C+"</dd>\
          </dl>\
          <dl class='row'>\
            <dt class='col-sm-3'>Age:</dt>\
            <dd class='col-sm-9'>"+val.B+"</dd>\
          </dl>\
          <dl class='row'>\
            <dt class='col-sm-3'>Status:</dt>\
            <dd class='col-sm-9'>"+val.E+"</dd>\
          </dl>\
        </div >\
      "
    );
    return this.data;
  }
}

export default Dhis;