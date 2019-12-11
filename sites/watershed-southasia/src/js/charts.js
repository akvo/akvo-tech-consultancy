import { gradients, titleCase} from './util.js';
const echarts = require('echarts');
const L = require('leaflet');

export const getFilter = (row) => {
    let html = `<div class="col-md-12">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <form class="form-inline my-2 my-lg-0">
                <div class="dropdown">
                    <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Location Gram Panchayat
                    </a>
                    
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                        <a class="dropdown-item" href="#">Action</a>
                        <a class="dropdown-item" href="#">Another action</a>
                        <a class="dropdown-item" href="#">Something else here</a>
                    </div>
                </div>&nbsp;&nbsp;&nbsp;&nbsp;
                <div class="dropdown">
                    <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Location Village
                    </a>
                    
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                        <a class="dropdown-item" href="#">Action</a>
                        <a class="dropdown-item" href="#">Another action</a>
                        <a class="dropdown-item" href="#">Something else here</a>
                    </div>
                </div>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Filter</button>
            </form>
        </nav>
    </div>`;
    $("#" + row).append(html);
}

export const getCharts = (title, chart, option, row, info, md, color) => {
    let html = `<div class="col-md-` + md + `">
                <div class="card">
                  <div class="card-header gradient-card-header ` + color + `-gradient">` + titleCase(title) + `</div>
                  <div class="card-body">
                    <div id="` + chart + `" style="height:450px"></div>
                  </div>
                  <div class="card-footer text-muted">` + info.content + `</div>
                </div>
                </div>`;
    $("#" + row).append(html);
    var element = document.getElementById(chart);
    var myChart = echarts.init(element);
    myChart.setOption(option);
}

export const getMaps = (title, map, option, row, info, md, color) => {
    let html = `<div class="col-md-` + md + `">
                <div class="card">
                  <div class="card-header gradient-card-header ` + color + `-gradient">` + titleCase(title) + `</div>
                  <div class="card-body">
                    <div id="` + map + `" style="height:450px"></div>
                  </div>
                  <div class="card-footer text-muted">` + info.content + `</div>
                </div>
                </div>`;
    $("#" + row).append(html);
    const mymap = L.map(map, { maxZoom: option.maxZoom }).setView([option.lat, option.lng], 15);
    const tileServer = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tileAttribution = 'Tiles © Wikimedia — Source: OpenStreetMap, Data: Unicef Pacific WASH, <a href="https://akvo.org">Akvo SEAP</a>';
    L.tileLayer(tileServer, {
        attribution: tileAttribution,
    }).addTo(mymap);
}