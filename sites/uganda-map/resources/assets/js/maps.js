import 'leaflet';

const custom = require('./custom.js'); 
const _ = require('lodash');
const axios = require('axios');

$('#stack_search a:nth-child(1)').css('display', 'inline-block');
$('#stack_search a:nth-child(2)').css('display', 'inline-block');
$('#stack_search a:nth-child(3)').css('display', 'inline-block');
$('#stack_search a:nth-child(4)').css('display', 'inline-block');
$('#stack_search a:nth-child(5)').css('display', 'inline-block');

let mkr = [];

$('#change-cluster').on('click', () => {
    let dataCache = JSON.parse(localStorage.getItem('data'));
    if (clustered === true) {
        map.removeLayer(markerclusters);
        clustered = false;
        changeValue(dataCache, getFilterData());
        $(this).addClass('btn-active');
    } else {
        $(this).removeClass('btn-active');
        map.removeLayer(mkr);
        mkr = [];
        clustered = true;
        changeValue(dataCache, getFilterData());
    }
});

let removeAllMap = () => map.eachLayer((layer) => {
    map.removeLayer(layer);
});

let geojson,
    geojsonPoly = null,
    legendPoly = null,
    labelPoly = null,
    popupPoly = false,
    activePoly = null,
    pieChart,
    pieClicked = false,
    activePie = null,
    metadata,
    clustered = true,
    cfg = [],
    sourcedata = [],
    defaultSelect = localStorage.getItem('default-api'),
    geojsonPath = '/api/data/',
    categoryField,
    iconField,
    popupFields,
    rmax = 30,
    selects = ["1", "2", "3", "4", "5"],
    markerclusters,
    map,
    indicatorColors = ["#28a745", "#dc3545", "#FA0", "#0288d1", "#ab47bc", "#40b1e6", "#ffca29"];

let cacheMem = JSON.parse(localStorage.getItem('data'));

let tileServer = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    tileAttribution = 'Tiles © Wikimedia — Source: OpenStreetMap, Data: Unicef Pacific WASH, <a href="https://akvo.org">Akvo SEAP</a>';

const fetchAPI = (endpoint) => {
    return new Promise((resolve, reject) => {
        axios.get('/api/' + endpoint).then(res => {
            resolve(res);
        }).catch(e => {
            reject(e);
        });
    });
};
    
const setConfig = (defaultSelect) => {
    fetchAPI('config/' + defaultSelect).then( // solve promise
        (res) => {
            localStorage.setItem("template", res.data.js)
            localStorage.setItem("configs", JSON.stringify(res.data));
            cfg = res.data;
            categoryField = cfg.name;
            iconField = categoryField;
            popupFields = cfg.popup;
            startRenderMap();
            cacheMem = JSON.parse(localStorage.getItem('data'));
            geojsonPath = '/api/data/' + defaultSelect;
            getGeoJson();
            localStorage.removeItem('status');
        }
    );
};

const clearFilteredData = () => {
    let dbs = JSON.parse(localStorage.getItem('data'));
    let cfg = JSON.parse(localStorage.getItem('configs'));
    if (!cfg.shapefile) {
        dbs['features'] = dbs['features'].map(x => {
            x.properties['status'] = 'active';
            return x;
        });
    }

    if (cfg.shapefile) {
        dbs['features']['features'] = dbs['features']['features'].map(x => {
            if (x.properties.data) {
                x.properties.data.map(y => {
                    y['status'] = 'active';
                    return y;
                });
            }
            return x;
        });
    }
    // return indicators into default
    dbs['properties']['attribution'] = dbs.properties.fields[cfg.name];
    localStorage.setItem('data', JSON.stringify(dbs));
};

const loadLocalData = () => {
    clearFilteredData();
    if (localStorage.getItem('configs')) {
        cfg = JSON.parse(localStorage.getItem('configs'));
        categoryField = cfg.name;
        iconField = categoryField;
        popupFields = cfg.popup;
        startRenderMap();
        cacheMem = JSON.parse(localStorage.getItem('data'));
        // geojsonPath = '/api/data/' + defaultSelect;
        // getGeoJson();
        loadData(cacheMem, 2);
        d3.select("#main-filter-list").html("");
        (localStorage.getItem('second-filter') !== null)
            ? renderSecondFilter()
            : "";
    } else {
        setConfig(defaultSelect);
    }
};

const setSelectedCategory = (id) => {
    let selected = false;
    let tagselected = "";
    if (defaultSelect === id.toString()) {
        selected = true;
    }
    if (selected) {
        tagselected = "selected";
    }
    return tagselected;
};

/* set category selected based on data load */
const fetchdata = () => {
    fetchAPI('source').then( // solve promise
        (a) => {
            if (!defaultSelect) {
                $('#category-dropdown').append('<option id="source-init" value=0 selected>SELECT SURVEY</option>');
                emptyMap();
            }
            a.data.forEach((x, i) => {
                $('#category-dropdown').append('<optgroup label="'+ x["source"].toUpperCase() +'" id='+ x["id"] +'></optgroup>'); 
                if (x.childrens.length > 0) {
                    x.childrens.forEach((y, i) => {
                        let selected = setSelectedCategory(y["id"]);
                        let id = "#" + x["id"];
                        $(id).append('<option value='+ y["id"] +' '+ selected + '>' + y["source"].toUpperCase() + '</option>');

                        if (y.childrens.length > 0) {
                            y.childrens.forEach((z, i) => {
                                let selected = setSelectedCategory(z["id"]);
                                $(id).append('<option value='+ z["id"] +' '+ selected + '>' + z["source"].toUpperCase() + '</option>');
                            });
                        }
                    });
                }
                geojsonPath = '/api/data/' + defaultSelect;
            }); 
            return defaultSelect;
        }
    ).then(val => {
        if (val) {
            (localStorage.getItem('data')) ? loadLocalData() : setConfig(val);
        }
    });
};
fetchdata();


$("#category-dropdown").on('change', () => {
    defaultSelect = $("#category-dropdown").val();
    if (defaultSelect == 0) {
        emptyMap();
    } else {
        $("#source-init").remove();
        geojsonPath = '/api/data/' + defaultSelect;
        $("#legend").children().remove();
        localStorage.removeItem('data');
        localStorage.removeItem('default-properties');
        localStorage.removeItem('configs');
        localStorage.removeItem('second-filter');
        localStorage.setItem('default-api', defaultSelect);
        if (!localStorage.getItem('status') && !cfg.shapefile) {
            map.removeLayer(markerclusters);
        } 
        $('#legend').remove();
        $('#bar-legend').remove();
        setConfig(defaultSelect);
    }
});

const setView = (latlng, zoom) => {
    map.setView(latlng, zoom);
    return;
};

const zoomView = (action) => {
    switch (action) {
        case 'in':
            map.zoomIn();
            break;
        case 'out':
            map.zoomOut();
            break;
        default:
            break;
    }
    return;
};

const emptyMap = () => {
    if (!map) {
        localStorage.setItem('status', 'init');
        map = L.map('mapid', {
            zoomControl: false
        }).setView([52.3667, 4.8945], 4);
        L.tileLayer(tileServer, {
            attribution: tileAttribution,
            maxZoom: 18
        }).addTo(map);
        d3.select('body').append('div').attr('id', 'main-filter-list');
    }
};

function hoverStyle(layer) {
    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

function highlightFeature(e) {
    var layer = e.target;
    let name = layer.feature.properties[cfg.shapename.match].toLowerCase();
    let dbs = (geojson === undefined) ? JSON.parse(localStorage.getItem('data')) : geojson;
    if (!popupPoly && name === activePoly) {
        activePoly = null;
    }
    if (popupPoly) {
        info.update(null);
        setPolygonMap(dbs, false, false);
        popupPoly = false;
        // clickOutsideLayer(layer);
    }
    if (name !== activePoly) {
        hoverStyle(layer);
        popupPoly = true;
        activePoly = layer.feature.properties[cfg.shapename.match].toLowerCase();
        setPolygonMap(dbs, false, true);
        info.update(layer.feature.properties);
    }
}

function tooltipFeature(e) {
    var layer = e.target;
    hoverStyle(layer);
    layer.bindTooltip(layer.feature.properties[cfg.shapename.match]).openTooltip();
}

function resetHighlight(e) {
    geojsonPoly.resetStyle(e.target);
    // info.update(null);
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    // add polygon labels
    let count = (feature.properties.data) 
        ? _.filter(feature.properties.data, x => x.status === 'active').length 
        : 0;
    let latlng = layer.getBounds().getCenter();
    if (feature.properties[cfg.shapename.match].toLowerCase() === "karambi") {
        latlng['lat'] = latlng['lat'] + 0.000000001;
        latlng['lng'] = latlng['lng'] - 0.02;
    }
    labelPoly = L.marker(latlng, {
        icon: L.divIcon({
            className: 'polygon-label',
            html: '<div class="polygon-label-container">('+count+')</div>',
            // iconSize: [40, 20]
        })
    }).addTo(map);
    // eol add labels
    layer.on({
        mouseover: tooltipFeature,
        mouseout: resetHighlight,
        // click: zoomToFeature
        click: highlightFeature
    });
}

// Custom info
var info = L.control();
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info-temp'); // create a div with a class "info"
    this.update();
    return this._div;
};

const getTemplate = () => {
    let data = JSON.parse(localStorage.getItem('data'));
    const template = custom.custom(data);
    let js = localStorage.getItem("template");
    return (js === null) ? false : template[js];
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    let template = getTemplate();
    props ? template.popup(props, categoryField, indicatorColors) : $('#geoshape-info').remove();
};

function getColor(d) {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function grayStyle(feature) {
    let color = (activePoly === feature.properties[cfg.shapename.match].toLowerCase())
        ? getColor(feature.properties.density)
        : "#666";
    return {
        fillColor: color,
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

const fetchPolygonMap = (cfg) => {
    return fetchAPI('geoshape/' + cfg.shapefile ).then(res => {
        localStorage.setItem('geojsonPoly', JSON.stringify(res.data));
        return res.data;
    });
};

const removePolygonMap = (removeLegend=false) => {
    (geojsonPoly) ? map.removeLayer(geojsonPoly) : null;
    (labelPoly) ? $(".polygon-label").remove() : null;
    if (removeLegend) {
        (legendPoly) ? $(".info.legend").remove() : null;
    }
};

const setPolygonMap = (data, init=false, changeStyle=false) => {
    removePolygonMap();
    let selected = (changeStyle) ? grayStyle : style;
    geojsonPoly = L.geoJson(data['features'], {style: selected, onEachFeature: onEachFeature});
    geojsonPoly.addTo(map);
    // map.fitBounds(geojsonPoly.getBounds()); // zoom map to position
    setView(cfg.center, 11); // zoom by level
    if (init) {
        pieChartEvent();
    }
    renderPieChart(data);
};

const filterPieData = (dbs) => {
    let attribution = dbs.properties.attribution;
    let filter = dbs.features.features.filter(x => x.properties.data !== null);
    let data = [];
    _.each(filter, x => {
        _.each(x.properties.data, y => {
            if (y.status === 'active') {
                data.push(y)
            }
        });
    });

    let tmp = [];
    _.each(attribution.lookup, (item, index) => {
        let value = [];
        // value = _.filter(data, (x) => x[attribution.id].toLowerCase() === item.toLowerCase());
        value = _.filter(data, (x) => x[attribution.id].toLowerCase() === attribution.sources[index].toLowerCase());
        tmp.push({
            value: value.length, 
            name: item
        });
    });
    return tmp;
};

const renderPieChart = (dbs, clicked=false) => {
    let attribution = dbs.properties.attribution;
    let pieData = filterPieData(dbs);
    let option = {
        title: {
            text: attribution.name,
            left: 'center'
        },
        tooltip: {
            show: false,
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
            {
                name: attribution.name,
                type: 'pie',
                startAngle: 180,
                radius: ['5%', '40%'],
                center: ['50%', '55%'],
                roseType: 'area',
                label: {
                    formatter: '{b} \n{c} ({d}%)',
                    fontWeight: 200,
                    alignTo: 'edge'
                },
                data: pieData
            }
        ],
    };

    if(attribution.type === "list") {
        option['color'] = (attribution.color.length > 0) ? attribution.color : indicatorColors.slice(0, attribution.lookup.length);
    }
    if (attribution.type === "num") {
        option["color"] = indicatorColors.slice(0, 1);
    }
    pieChart.setOption(option);
    return;
};

const pieChartEvent = () => {
    let pie = pieChart.getZr();
    pie.on('click', function (params) {
        let dbs = JSON.parse(localStorage.getItem('data'));
        if (params.target !== undefined && pieClicked && activePie === params.target.dataIndex) {
            pieClicked = false;
            activePie = null;
            $(".category-" + params.target.dataIndex).click();
            changeValue(dbs, []);
            return;
        }
        if (params.target !== undefined && !pieClicked && activePie == null) {
            pieClicked = true;
            activePie = params.target.dataIndex;
            $(".category-" + params.target.dataIndex).click();
            // let del = dbs.properties.attribution.lookup;
            let del = dbs.properties.attribution.sources;
            del = del.filter(x => x.toLowerCase() !== del[activePie].toLowerCase());
            changeValue(dbs, del);
            return;
        }
    });
};

const startRenderMap = () => {
    if (!cfg.shapefile) {
        $('#piechart-tmp').remove();
        markerclusters = L.markerClusterGroup({
            maxClusterRadius: 2 * rmax,
            iconCreateFunction: defineClusterIcon
        });
    }

    if (!map) {
        map = L.map('mapid', {
            zoomControl: false
        }).setView(cfg.center, 7);
        L.tileLayer(tileServer, {
            attribution: tileAttribution,
            maxZoom: 18
        }).addTo(map);
        d3.select('body').append('div').attr('id', 'main-filter-list');
    }
    // polygon
    if (cfg.shapefile) {
        // render pie chart template
        let pieId = 'piechart-tmp';
        d3.select('body').append('div').attr('id', pieId);
        $('#'+pieId).draggable(); // Make the DIV element draggable:
        pieChart = echarts.init(document.getElementById(pieId));

        (localStorage.getItem('data')) 
            ? setPolygonMap(JSON.parse(localStorage.getItem('data')), true)
            : fetchPolygonMap(cfg).then(res => res);
        info.addTo(map);

        legendPoly = L.control({position: 'bottomleft'});
        legendPoly.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 10, 20, 50, 100, 200, 500, 1000],
                labels = [];

            // loop through our density intervals and generate a label with a colored square for each interval
            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }

            return div;
        };
        legendPoly.addTo(map);
    }
    // cluster
    if (!cfg.shapefile) {
        removePolygonMap(true);
        map.addLayer(markerclusters);
    }
};

const mapParentFeatures = (parents, features) => {
    return features.map(item => {
        let point = parents.find(x => x.data_point_id === item.properties.data_point_id);
        item.geometry.coordinates = point.geometry;
        return item;
    });
};

//Ready to go, load the geojson
const getGeoJson = () => {
    d3.json(geojsonPath, (error, response) => {
        // data will be agreagated value if map is polygon
        if (response.second_categories !== 'null') {   
            localStorage.setItem('second-filter', response.second_categories);
        }
        let categories = JSON.parse(response.categories);
        let coptions = _.mapValues(_.keyBy(categories, 'id'), 'lookup');
        let configs = JSON.parse(response.config);
        let source = JSON.parse(response.data);
        let data = {
            properties: {
                fields: _.mapValues(_.keyBy(categories, 'id')),
                attribution: _.find(categories, {
                    id: categoryField
                }),
                attributes: categories
            }
        }

        // poly
        if (configs.shapefile) {
            let groupData = _.groupBy(source, configs.shapename.sources);
            fetchPolygonMap(configs).then(res => {
                data['features'] = {
                    type: "FeatureCollection",
                    features: res.features.map(val => {
                        let match = val.properties[configs.shapename.match];
                        return {
                            ...val,
                            properties: {
                                ...val.properties,
                                density: (groupData[""+match+""]) ? groupData[""+match+""].length : 0,
                                data: (groupData[""+match+""]) 
                                        ? groupData[""+match+""].map(x => {
                                            return { ...x, status: "active" }
                                        }) 
                                        : null,
                                status: "active"
                            }
                        }
                    })
                }

                localStorage.setItem('data', JSON.stringify(data));
                let retrievedObject = localStorage.getItem('data');
                data = JSON.parse(retrievedObject);
                setPolygonMap(data, true);
                loadData(data, 2);
                d3.select("#main-filter-list").html("");
                (localStorage.getItem('second-filter') !== null)
                    ? renderSecondFilter()
                    : "";
            });
        }

        // clusters
        if (!configs.shapefile) {
            data['features'] = source.map(val => {
                return {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: val.PTS
                    },
                    properties: {
                        ...val,
                        status: "active"
                    }
                }
            });
        }
        localStorage.setItem('default-properties', JSON.stringify(data.properties));
        if (response.type === 'registration' && !configs.shapefile) {
            let parent_points = source.map(x => {
                return {
                    geometry : x.PTS,
                    data_point_id : x.data_point_id
                };
            });
            localStorage.setItem('parent_'+response.id, JSON.stringify(parent_points));    
        }

        if (response.type === 'monitoring' && !configs.shapefile) {
            let parents = JSON.parse(localStorage.getItem('parent_' + response.parent_id));
            data = {
                ...data,
                features: mapParentFeatures(parents, data.features)
            };
        }

        if (!configs.shapefile) {
            localStorage.setItem('data', JSON.stringify(data));
            let retrievedObject = localStorage.getItem('data');
            data = JSON.parse(retrievedObject);
            loadData(data, 2);
            d3.select("#main-filter-list").html("");
            (localStorage.getItem('second-filter') !== null)
                ? renderSecondFilter()
                : "";
        }
    });
}

const renderSecondFilter = () => {
    let seconds = JSON.parse(localStorage.getItem('second-filter'));
    seconds.forEach((item, index) => {
        let name = item.name.toLowerCase();
        name = name.split(' ');
        name = name.join('-');
        $('#'+name+'-filter').css('display', 'inline-block');
        d3.select('#main-filter-list').append('div').attr('class', 'legend_'+index+'').attr('id', ''+name+'-parent').text(item.name);
        d3.select('#main-filter-list').append('div').attr('id', 'sf-'+index+'-list');    
        let values = item.values;
        if (item.type === 'cascade') {
            values = item.values.filter(x => x.level === 0);
        }
        // values = values.slice(0, 10); // sample shound be not used
        // consider about sf-list-index class and sf-all-index class, if more than 2 filter need to create more css
        values.forEach((x, i) => {
            // create second filter item
            let code = (item.type === 'cascade') ? x.code : x.value;
            let text = (item.type === 'cascade') ? x.name : x.text;
            var id = code.toLowerCase();
            id = id.split(' ');
            id = id.join('-');
            d3.select('#sf-'+index+'-list')
                .append('a')
                .attr('id', ''+name+'-'+i)
                .text(text)
                .on('click', function (a) {
                    filterBySecondFilter(text, 'sf-' + index + '', ''+name+'-'+i, item.id, item.type, name);
                });
        });
        d3.select('#sf-'+index+'-list').append('button')
            .attr('class', 'btn')
            .attr('id', 'sf-'+index+'-all')
            .attr('data-select', 'remove')
            .text('Disable All')
            .on('click', function(a) {
                filterBySecondFilter('options', 'sf-'+index+'', 'all', item.id, item.type, name);
            });
        $('.legend_'+index+'').click(function(e) {
            $('#sf-'+index+'-list').slideToggle();
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
            } else {
                $(this).addClass('active');
                for (let x = 0; x < seconds.length; x++) {
                    if (x !== index) {
                        if ($('.legend_'+x+'').hasClass('active')) {
                            $('.legend_'+x+'').click();
                        };
                    }
                }
            }
        });
    });  
};

const filterBySecondFilter = (dataName, type, dataId, key, filterType, name) => {
    var dbs = JSON.parse(localStorage.getItem('data'));
    if (dataName === 'options') {
        var dataSelection = $('#' + type + '-all').attr('data-select');
        if (dataSelection === 'add') {
            $('#' + type + '-list > a').removeClass('inactive');
            $('#' + type + '-all').removeClass('enable-all');
            $('#' + type + '-all').text('Disable All');
            $('#' + type + '-all').attr('data-select', 'remove');
        } else {
            $('#' + type + '-list > a').addClass('inactive');
            $('#' + type + '-all').addClass('enable-all');
            $('#' + type + '-all').text('Enable All');
            $('#' + type + '-all').attr('data-select', 'add');
        }
    } else {
        $('#' + type + '-all').addClass('enable-all');
        $('#' + type + '-all').text('Enable All');
        $('#' + type + '-all').attr('data-select', 'add');
    }
    
    if (!cfg.shapefile) {
        dbs["features"] = $.map(dbs.features, (x) => {
            x = x;
            // if (x.properties['status'] === 'active') {
                if (dataName === 'options') {
                    if (dataSelection === 'add') {
                        x.properties['status'] = 'active';
                    } else {
                        x.properties['status'] = 'inactive';
                    }
                } else {
                    let answer = x.properties[key].toLowerCase();
                    // let condition = (filterType === 'cascade') ? answer.includes(dataName.toLowerCase()) : answer === dataName.toLowerCase();
                    let condition = answer.includes(dataName.toLowerCase());
                    if (condition) {
                        if (x.properties['status'] === "active") {
                            x.properties['status'] = "inactive";
                            $('#' + dataId).addClass('inactive');
                        } else {
                            x.properties['status'] = "active";
                            $('#' + dataId).removeClass('inactive');
                        }
                    }
                    // else {
                    //     if (x.properties['status_tmp'] === "active" || x.properties['status_tmp'] === undefined) {
                    //         x.properties['status_tmp'] = "inactive";
                    //         $('#' + dataId).addClass('inactive');
                    //     } else {
                    //         x.properties['status_tmp'] = "active";
                    //         $('#' + dataId).removeClass('inactive');
                    //     }
                    // }
                }
            // }
            return x;
        });
    }
    if (cfg.shapefile) {
        dbs["features"]["features"] = $.map(dbs.features.features, (x) => {
            x = x;
            if (x.properties.data) {
                $.map(x.properties.data, y => {
                    // if (y['status'] === 'active') {
                        if (dataName === 'options') {
                            if (dataSelection === 'add') {
                                y['status'] = 'active';
                            } else {
                                y['status'] = 'inactive';
                            }
                        } else {
                            let answer = y[key].toLowerCase();
                            // let condition = (filterType === 'cascade') ? answer.includes(dataName.toLowerCase()) : answer === dataName.toLowerCase();
                            let condition = answer.includes(dataName.toLowerCase());
                            if (condition) {
                                if (y['status'] === "active") {
                                    y['status'] = "inactive";
                                    $('#' + dataId).addClass('inactive');
                                } else {
                                    y['status'] = "active";
                                    $('#' + dataId).removeClass('inactive');
                                }
                            }
                        }
                    // }
                    return y;
                });
            }
            return x;
        });
        renderPieChart(dbs);
    }
    refreshLayer(dbs);
};

const loadData = (allPoints, callType) => {
    if (callType === 1) {
        let defaultProp = JSON.parse(localStorage.getItem('default-properties'));
        allPoints.features = _.map(allPoints.features, (x) => {
            x['properties']['status'] = "active";
            return x;
        });
        allPoints.properties = defaultProp;
    }
    
    metadata = allPoints.properties;
    if (!cfg.shapefile) {
        geojson = allPoints;
        let markers = L.geoJson(geojson, {
            pointToLayer: defineFeature,
            onEachFeature: defineFeaturePopup
        });
        markerclusters.addLayer(markers);
        map.fitBounds(markers.getBounds());
        map.attributionControl.addAttribution(metadata.attribution);
    }
    renderLegend(allPoints);
}

const defineFeature = (feature, latlng) => {
    if (feature.properties.status === 'active') {
        let categoryVal = feature.properties[categoryField],
            iconVal = feature.properties[iconField];
        let idx_num = _.findIndex(metadata.attribution.lookup, (el => el === categoryVal));
		if (idx_num === -1) {
			idx_num = "undefined";
		}
        let myClass = 'marker category-' + idx_num + ' icon-' + idx_num;
        let iconSize = null;
        if (!clustered) {
            iconSize = 10;
        }
        let myIcon = L.divIcon({
            className: myClass,
            iconSize: iconSize
        });
        return L.marker(latlng, {
            icon: myIcon
        });
    };
    return;
}

// Pop up when point clicked
const defineFeaturePopup = (feature, layer) => {
    let props = feature.properties,
        fields = metadata.fields,
        popupContent = '';
    popupContent = '<span class="attribute"><span class="label">Name:</span> ' + props[popupFields] + '</span>';
    popupContent = '<div class="map-popup">' + popupContent + '<hr><button href="#" class="btn btn-primary btn-block" onclick="getDetails(this, 0)" data="' + props.data_point_id + '"><i class=""></i> View Details</button></div>';
    layer.bindPopup(popupContent, {
        offset: L.point(1, -2)
    });
};

const defineClusterIcon = (cluster) => {
    let dbs = cluster.getAllChildMarkers();
    dbs = $.map(dbs, (x) => {
        if (x.feature.properties.status === 'active') {
            return x;
        }
        return;
    });
    let children = dbs,
        n = children.length, //Get number of markers in cluster
        strokeWidth = 1, //Set clusterpie stroke width
        r = rmax - 2 * strokeWidth - (n < 10 ? 12 : n < 100 ? 8 : n < 1000 ? 4 : 0), //Calculate clusterpie radius...
        iconDim = (r + strokeWidth) * 2, //...and divIcon dimensions (leaflet really want to know the size)
        data = d3.nest() //Build a dataset for the pie chart
        .key((d => d.feature.properties[categoryField]))
        .entries(children, d3.map),
        //bake some svg markup
        html = bakeThePie({
            data: data,
            valueFunc: (d => d.values.length),
            strokeWidth: 1,
            outerRadius: r,
            innerRadius: r - 10,
            pieClass: 'cluster-pie',
            pieLabel: n,
            pieLabelClass: 'marker-cluster-pie-label',
            pathClassFunc: (d) => {
                let idx_num = _.findIndex(metadata.attribution.lookup, (el => el === d.data.key));
				if (idx_num === -1) {
					idx_num = "undefined";
				}
                return "category-" + idx_num;
            },
            pathTitleFunc: (d) => {
                let percentage = ((d.data.values.length / n) * 100).toFixed(2);
				if(metadata.fields[categoryField].type === "num") {
					let customfields = {"lookup":{1:"No Filter"}, "Name": "No Filter"}
					metadata["fields"][categoryField] = customfields;
				}
                return metadata.fields[categoryField].lookup[d.data.key] + ' (' + d.data.values.length + ' point' + (d.data.values.length != 1 ? 's' : '') + ', ' + percentage + '%)';
            }
        }),

        //Create a new divIcon and assign the svg markup to the html property
        myIcon = new L.DivIcon({
            html: html,
            className: 'marker-cluster',
            iconSize: new L.Point(iconDim, iconDim)
        });
    return myIcon;
}

/*function that generates a svg markup for the pie chart*/
const bakeThePie = (options) => {
    /*data and valueFunc are required*/
    if (!options.data || !options.valueFunc) {
        return '';
    }
    let data = options.data,
        valueFunc = options.valueFunc,
        r = options.outerRadius ? options.outerRadius : 28, //Default outer radius = 28px
        rInner = options.innerRadius ? options.innerRadius : r - 10, //Default inner radius = r-10
        strokeWidth = options.strokeWidth ? options.strokeWidth : 1, //Default stroke is 1
        pathClassFunc = options.pathClassFunc ? options.pathClassFunc : () => {
            return '';
        }, //Class for each path
        pathTitleFunc = options.pathTitleFunc ? options.pathTitleFunc : () => {
            return '';
        }, //Title for each path
        pieClass = options.pieClass ? options.pieClass : 'marker-cluster-pie', //Class for the whole pie
        pieLabel = options.pieLabel ? options.pieLabel : d3.sum(data, valueFunc), //Label for the whole pie
        pieLabelClass = options.pieLabelClass ? options.pieLabelClass : 'marker-cluster-pie-label', //Class for the pie label
        origo = (r + strokeWidth), //Center coordinate
        w = origo * 2, //width and height of the svg element
        h = w,
        donut = d3.layout.pie(),
        arc = d3.svg.arc().innerRadius(rInner).outerRadius(r);

    //Create an svg element
    let svg = document.createElementNS(d3.ns.prefix.svg, 'svg');

    //Create the pie chart
    let vis = d3.select(svg)
        .data([data])
        .attr('class', pieClass)
        .attr('width', w)
        .attr('height', h);
    let arcs = vis.selectAll('g.arc')
        .data(donut.value(valueFunc))
        .enter().append('svg:g')
        .attr('class', 'arc')
        .attr('transform', 'translate(' + origo + ',' + origo + ')');
    arcs.append('svg:path')
        .attr('class', pathClassFunc)
        .attr('stroke-width', strokeWidth)
        .attr('d', arc)
        .append('svg:title')
        .text(pathTitleFunc);
    vis.append('text')
        .attr('x', origo)
        .attr('y', origo)
        .attr('class', pieLabelClass)
        .attr('text-anchor', 'middle')
        //.attr('dominant-baseline', 'central')
        /*IE doesn't seem to support dominant-baseline, but setting dy to .3em does the trick*/
        .attr('dy', '.3em')
        .text(pieLabel);

    //Return the svg-markup rather than the actual element
    return serializeXmlNode(svg);
}

/*Function for generating a legend with the same categories as in the clusterPie*/
const renderLegend = (database) => {
    let id = 'css-single-click'; // custom css form single selection
    let data = d3.entries(metadata.fields[categoryField].lookup),
        legenddiv = d3.select('body').append('div')
            .attr('id', 'legend');
    let indicators = d3.entries(metadata.attributes);
    $('#legend').append('<select class="custom-select" id="indicators"></select>');
    indicators = indicators.filter(x => x.value.type !== 'text');
    indicators.forEach((s) => {
        let selected = '';
        if (s.value.id == metadata.attribution.id) {
            selected = 'selected';
        }
        $('#indicators').append('<option value="' + s.value.id + '$' + s.value.type + '"' + selected + '>' + s.value.name + '</options>');
    });
    let dropdown = d3.select('#indicators');
    dropdown
        .on('change', function (a) {
            // change active pie to null when dropdown change
            pieClicked = false;
            activePie = null;
            if (document.getElementById(id)) {
                document.getElementById(id).remove(); 
            }
            // eol
            let selectedVal = this.value.split('$')[0],
                selectedInd = selectedVal.split('-');
            let dbs = JSON.parse(localStorage.getItem('data'));
            dbs.properties.attribution = dbs.properties.fields[selectedVal];
            localStorage.setItem('data', JSON.stringify(dbs));
            $('#bar-legend').remove();
            localStorage.removeItem('chartPos');
            localStorage.removeItem('filterPos');
            if (dbs.properties.attribution.type === 'list' || dbs.properties.attribution.type === 'multiple') {
                legenddiv.remove();
                categoryField = selectedVal;
                iconField = categoryField;
                changeValue(dbs, []);
                renderLegend(dbs);
            } else {
                $('#piechart-tmp').remove();
                createHistogram();
                categoryField = selectedVal;
                iconField = categoryField;
                changeValue(dbs, []);
            }
        });
    let heading = legenddiv.append('div')
        .classed('legendheading', true)
        .text(metadata.attribution.name);
    $('#legend').append('<hr>');
    let legenditems = legenddiv.selectAll('.legenditem')
        .data(data);
   
    // create new css for the indicators, if there was color setup
    createCss(metadata.fields[categoryField]);
    let ind = (cfg.shapefile) ? "indicator" : "";
    let counts = (cfg.shapefile) ? filterPieData(database) : null;
    legenditems
        .enter()
        .append('div')
        .attr('class', (d => ind + ' category-' + d.key))
        .attr('data-value', (d => d.key))
        .attr('id', (d => 'legend-select-' + d.value))
        .on('click', function (d) {
            if (!cfg.shapefile) {
                $('.leaflet-marker-icon').remove();
                if ($(this).hasClass('inactive-legend')) {
                    $(this).removeClass('inactive-legend');
                    if ($('.inactive-legend').length > 1) {
                        let inactive = $('.inactive-legend').attr('class').split(' ')[0];
                    }
                } else {
                    $(this).addClass('inactive-legend');
                };
            }
            if (cfg.shapefile) {
                if (document.getElementById(id)) {
                    document.getElementById(id).remove(); 
                }
                let style = document.createElement('style');
                style.type = 'text/css';
                style.id = id;
                style.innerHTML = '.indicator{ background-color: #222; pointer-events : none; }.indicator:before{ font-family: "FontAwesome"; font-weight: 900; padding-right: 10px; content: "\\f057"; }';
                document.getElementsByTagName('head')[0].appendChild(style);
                
                if ($(this).hasClass('active-indicator')) {
                    $(this).removeClass('active-indicator');
                    $(this).addClass('indicator');
                    document.getElementById(id).remove(); 
                    if ($('.active-indicator').length > 1) {
                        let active = $('.active-indicator').attr('class').split(' ')[0];
                    }
                } else {
                    $(this).removeClass('indicator');
                    $(this).addClass('active-indicator');
                };
            }
            changeValue(database, getFilterData());
        })
        .classed({
            'legenditem': true
        })
        .text(function(d) {
            if (cfg.shapefile) {
                let count = counts.filter(x => x.name.toLowerCase() === d.value.toLowerCase());
                count = ' ('+count[0].value+')';
                return d.value + count;
            }
            if (!cfg.shapefile) {
                return d.value;
            }
        });
};

const createCss = (conf) => {
    let id = 'css-dynamic-color';
    if (document.getElementById(id)) {
        document.getElementById(id).remove(); 
    }

    if (conf.color !== undefined && conf.color.length > 0) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.id = id;
        
        conf.color.forEach((val, index) => {
            style.innerHTML += '.category-'+index+' { background-color: '+val+'; fill: '+val+'; stroke: '+val+'; border-color: '+val+'; }';
        });
        style.innerHTML += '.inactive-legend { background-color: #222 }';
        document.getElementsByTagName('head')[0].appendChild(style);
    }
};

const getFilterData = () => {
    let selects = ["1", "2", "3", "4", "5"];
    let deletes = [];
    
    if (!cfg.shapefile) {
        $('.inactive-legend').each(function() {
            let inactive = $(this).attr('class').split(' ')[0];
            // deletes.push(metadata.attribution.lookup[inactive.split('-')[1]]);
            deletes.push(metadata.attribution.sources[inactive.split('-')[1]]);
        });
    }
    if (cfg.shapefile) {
        $('.active-indicator').each(function() {
            let active = $(this).attr('class').split(' ')[0];
            // deletes = metadata.attribution.lookup.filter(x => x.toLowerCase() !== metadata.attribution.lookup[active.split('-')[1]].toLowerCase()); // remove the active indicators
            let index = _.findIndex(metadata.attribution.lookup, x => x.toLowerCase() === metadata.attribution.lookup[active.split('-')[1]].toLowerCase());
            deletes = metadata.attribution.sources.filter(x => x.toLowerCase() !== metadata.attribution.sources[index].toLowerCase()); // remove the active indicators
        });
    }
    // let filterData = $.map(selects, (x) => {
    //     if (deletes.indexOf(x) >= 0) {
    //         return;
    //     }
    //     return x;
    // });
    return deletes;
}

const refreshLayer = (dbs) => {
    localStorage.setItem('data', JSON.stringify(dbs));
    geojson = dbs;
    metadata = dbs.properties;
    if (!cfg.shapefile) {
        if (clustered) {
            map.removeLayer(markerclusters);
            markerclusters = L.markerClusterGroup({
                maxClusterRadius: 2 * rmax,
                iconCreateFunction: defineClusterIcon
            });
            map.addLayer(markerclusters);
            let markers = L.geoJson(dbs, {
                pointToLayer: defineFeature,
                onEachFeature: defineFeaturePopup
            });
            markerclusters.addLayer(markers);
            map.attributionControl.addAttribution(metadata.attribution);
        } else {
            map.removeLayer(mkr);
            mkr = L.geoJson(dbs, {
                pointToLayer: defineFeature,
                onEachFeature: defineFeaturePopup
            });
            map.addLayer(mkr);
            map.attributionControl.addAttribution(metadata.attribution);
        }
    }
    if (cfg.shapefile) {
        geojson["features"]["features"] = _.map(geojson["features"]["features"], val => {
            return {
                ...val,
                properties: {
                    ...val.properties,
                    density: _.filter(val.properties.data, (x) => { return x.status === 'active' }).length,
                }
            }
        });
        // reset popup
        activePoly = null;
        popupPoly = false;
        info.update(null);
        // eol reset popup 
        setPolygonMap(geojson);
    }
};

const changeValue = (database, deletes) => {
    var dbs = JSON.parse(localStorage.getItem('data'));
    if (!cfg.shapefile) {
        dbs["features"] = $.map(dbs.features, (x) => {
            x = x;
            x.properties.status = "active";
            if (deletes.indexOf(x.properties[iconField]) >= 0) {
                x.properties.status = "inactive";
            }
            return x;
        });
    }
    if (cfg.shapefile) {
        dbs["features"]["features"] = $.map(dbs.features.features, (x) => {
            x = x;
            if (x.properties.data) {
                $.map(x.properties.data, y => {
                    y.status = "active";
                    if (deletes.indexOf(y[iconField]) >= 0) {
                        y.status = "inactive";
                    }
                    return y;
                });
            }
            return x;
        });
    }
    refreshLayer(dbs);
}

const filterMaps = (minVal, maxVal, attributeName) => {
    var dbs = JSON.parse(localStorage.getItem('data'));
    if (!cfg.shapefile) {
        dbs["features"] = $.map(dbs.features, (x) => {
            if (minVal === 0 && maxVal === 0) {
                x.properties.status = "active";
            } else {
                x.properties.status = "inactive";
                if (x.properties[attributeName] >= minVal && x.properties[attributeName] <= maxVal || x.properties[attributeName] === maxVal) {
                    x.properties.status = "active";
                }
                if (x.properties[attributeName] === 0) {
                    x.properties.status = "inactive";
                }
            }
            return x;
        });
    }
    if (cfg.shapefile) {
        dbs["features"]["features"] = $.map(dbs.features.features, (x) => {
            if (x.properties.data) {
                $.map(x.properties.data, (y) => {
                    if (minVal === 0 && maxVal === 0) {
                        y.status = "active";
                    } else {
                        y.status = "inactive";
                        if (y[attributeName] >= minVal && y[attributeName] <= maxVal || y[attributeName] === maxVal) {
                            y.status = "active";
                        }
                        if (y[attributeName] === 0) {
                            y.status = "inactive";
                        }
                    }
                    return y;
                });
            }
            return x;
        });
    }
    refreshLayer(dbs);
}

const createHistogram = () => {
    let dbs = JSON.parse(localStorage.getItem('data'));
    // ignore construction year with 0 value (M index)
    if (!cfg.shapefile) {
        dbs.features = _.filter(dbs.features, x => x.properties["M"] > 0);
    }
    // eol ignore construction year with 0 value
    let attr_name = dbs.properties.attribution.id;
    let barData = [];
    if (!cfg.shapefile) {
        barData = dbs.features.map((x) => {
            // let obj = {};
            return {
                'datapoint name': x.properties[cfg.name],
                'indicator': attr_name,
                'value': x.properties[attr_name],
            };
        });
    }
    if (cfg.shapefile) {
        let temp = []
        dbs.features.features.map(x => {
            if (x.properties.data) {
                x.properties.data.map(y => {
                    temp.push(y);
                });
            }
            return;
        });
        barData = temp.map((x) => {
            // let obj = {};
            return {
                'datapoint name': x[cfg.name],
                'indicator': attr_name,
                'value': x[attr_name],
            };
        });
    }
    let dataGroup = _.groupBy(barData, 'value');
    let histogram = _.map(dataGroup, (v, i) => {
        return {
            len: v.length,
            val: v[0].value
        };
    });
    histogram = _.orderBy(histogram, ['val'], ['asc']);
    let barlegenddiv = d3.select('body').append('div')
        .attr('id', 'bar-legend');
    let heading = barlegenddiv.append('div')
        .classed('legendheading', true)
        .text(attr_name);
    $('.legenditem').remove();
    $('.legendheading').remove();
    $('#legend > hr').remove();
    $('#legend').css('box-shadow', 'None');
    $('#legend').css('-webkit-box-shadow', 'None');
    let dom = document.getElementById("bar-legend");
    let myChart = echarts.init(dom);
    let app = {};
    let chartPos = JSON.parse(localStorage.getItem('chartPos'));
    if (chartPos === null) {
        chartPos = [0, 100];
        filterMaps(0, 100, attr_name);
    } else {
        let filterPos = JSON.parse(localStorage.getItem('filterPos'));
        filterMaps(filterPos[0], filterPos[1], attr_name);
    }
    let variableName = dbs.properties.attribution.name.replace(/_/g, ' ').toUpperCase();
    let barOption = {
        title: {
            center: 'left',
            top: 10,
            left: '10%',
            textStyle: {
                fontFamily: 'Roboto',
            },
            text: variableName,
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            backgroundColor: 'rgba(245, 245, 245, 0.8)',
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            textStyle: {
                color: '#000'
            },
            trigger: 'axis',
            position: (pt => [pt[0], '100%']),
            formatter: (param => param[0]['value'] + ' Datapoints</br>' + variableName + ': ' + param[0]['axisValue'])
        },
        xAxis: {
            min: (chartPos[0] === 0 ? -1 : chartPos[0] - 1),
            name: variableName,
            type: 'category',
            nameGap: 30,
            nameLocation: 'middle',
            data: histogram.map(x => x.val),
            boundaryGap: false,
        },
        grid: {
            top: 80,
            left: '10%',
            containLabel: true,
        },
        yAxis: {
            offset: 10,
            name: 'DATAPOINT TOTAL',
            nameTextStyle: {
                padding: 20,
            },
            nameLocation: 'middle',
            nameGap: 10,
            type: 'value',
            boundaryGap: [0, '100%']
        },
        dataZoom: [{
            type: 'inside',
            start: (chartPos[0] === 0 ? -1 : (chartPos[0] - 1)),
            end: chartPos[1]
        }, {
            type: 'slider',
            bottom: 0,
            start: (chartPos[0] === 0 ? -1 : (chartPos[0] - 1)),
            end: chartPos[1],
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '100%',
            rangeMode: 'value',
            handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2,
            }
        }],
        series: [{
            name: attr_name.replace(/_/g, " ").toUpperCase(),
            type: 'bar',
            large: false,
            barMaxWidth: 20,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
                color: '#28a745'
            },
            data: histogram.map(x => x.len),
        }]
    };;
    if (barOption && typeof barOption === "object") {
        myChart.setOption(barOption, true);
    }
    myChart.on('dataZoom', (a) => {
        let axis = myChart.getModel().option.xAxis[0];
        let minVal = axis.data[axis.rangeStart];
        let maxVal = axis.data[axis.rangeEnd];
        let newPos = [a.start, a.end];
        localStorage.setItem('chartPos', JSON.stringify(newPos));
        if (a.start === 0) {
            minVal = axis.data[0];
        }
        if (minVal === undefined){
            minVal = 0;
        }
        if (maxVal === undefined){
            let totVal = axis.data[axis.data.length - 1];
            maxVal = totVal;
        }
        localStorage.setItem('filterPos', JSON.stringify([minVal, maxVal]))
        filterMaps(minVal, maxVal, attr_name);
    });
}

/*Helper function*/
const serializeXmlNode = (xmlNode) => {
    if (typeof window.XMLSerializer != "undefined") {
        return (new window.XMLSerializer()).serializeToString(xmlNode);
    } else if (typeof xmlNode.xml != "undefined") {
        return xmlNode.xml;
    }
    return "";
}

maps = map;
customs = custom;
goToView = setView;
zoomMap = zoomView;
getTemplates = getTemplate;