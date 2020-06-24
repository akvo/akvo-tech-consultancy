class Dhis {
  constructor(data) {
    this.data = data;
  };

  popup(a) {
    let data = this.data.features.find(x => x.properties.data_point_id === a);
    $(".modal-body").html("<h1>"+ data.properties.E  +"</h1>");
    return this.data;
  }
}

export default Dhis;