const _ = require('lodash');

class Dhis {
  constructor(data) {
    this.data = data;
  };

  popup(datapointid) {
    let data = this.data.features.find(x => x.properties.data_point_id === datapointid);
    let configs = JSON.parse(localStorage.getItem('configs'));
    _.mapKeys(data.properties, (val, key) => {
      if (configs[key] !== undefined) {
        console.log(key, configs[key], val);
      }
    });
    
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