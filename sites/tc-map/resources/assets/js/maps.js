import 'leaflet';
const _ = require('lodash');
const axios = require('axios');

$('#stack_search a:nth-child(1)').css('display', 'inline-block');
$('#stack_search a:nth-child(2)').css('display', 'inline-block');
$('#stack_search a:nth-child(3)').css('display', 'inline-block');
$('#stack_search a:nth-child(4)').css('display', 'inline-block');
$('#stack_search a:nth-child(5)').css('display', 'inline-block');

let mkr = [];

$('#change-cluster').on('click', function() {
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

let removeAllMap = () => map.eachLayer(function (layer) {
    map.removeLayer(layer);
});


let geojson,
    metadata,
    clustered = true,
    cfg = [],
    sourcedata = [],
    sourcefetch = axios.get('/api/source').then((res) => {return res.data}),
    defaultSelect = localStorage.getItem('default-api'),
    geojsonPath = '/api/data/',
    categoryField,
    iconField,
    popupFields,
    rmax = 30,
    selects = ["1", "2", "3", "4", "5"],
    markerclusters,
    map;

let cacheMem = JSON.parse(localStorage.getItem('data'));

let tileServer = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    tileAttribution = 'Tiles © Wikimedia — Source: OpenStreetMap, Data: Unicef Pacific WASH, <a href="https://akvo.org">Akvo SEAP</a>';

let setConfig = axios.get('/api/config/' + defaultSelect).then(
    (res) => {
        localStorage.setItem("configs", JSON.stringify(res.data));
        cfg = res.data;
        categoryField = cfg.name;
        iconField = categoryField;
        popupFields = cfg.name;
        startRenderMap();
        cacheMem = JSON.parse(localStorage.getItem('data'));
        geojsonPath = '/api/data/' + defaultSelect,
        getGeoJson();
    }
);


let fetchdata = sourcefetch.then(
    (a) => {
        a.forEach((x, i) => {
            let selected = false;
            let tagselected = "";
            if (!defaultSelect && (i === 0)) {
                selected = true;
                localStorage.setItem('default-api', x["id"]);
                defaultSelect = x["id"];
            }
            if (defaultSelect === x["id"].toString()) {
                selected = true;
            }
            if (selected) {
                tagselected = "selected";
            }
            geojsonPath = '/api/data/' + defaultSelect,
            $('#category-dropdown').append('<option value=' + x["id"] + ' ' + tagselected + '>' + x["source"].toUpperCase() + '</option>');
        });
        return "second"
    }
);

$("#category-dropdown").change(function () {
    defaultSelect = $(this).val();
    geojsonPath = '/api/data/' + defaultSelect,
    $("#legend").children().remove();
    localStorage.removeItem('data');
    localStorage.removeItem('default-properties');
    localStorage.removeItem('configs');
    localStorage.setItem('default-api', defaultSelect);
    map.removeLayer(markerclusters);
    $('#legend').remove();
    $('#bar-legend').remove();
    axios.get('api/config/' + defaultSelect).then((res) => {
        localStorage.setItem("configs", JSON.stringify(res.data));
        cfg = res.data;
        categoryField = cfg.name;
        iconField = categoryField;
        popupFields = cfg.name;
        cacheMem = JSON.parse(localStorage.getItem('data'));
        geojsonPath = '/api/data/' + defaultSelect,
        startRenderMap();
        getGeoJson();
    });
});

function startRenderMap() {
    markerclusters = L.markerClusterGroup({
        maxClusterRadius: 2 * rmax,
        iconCreateFunction: defineClusterIcon
    });

    if(!map) {
        map = L.map('mapid', {
            zoomControl: false
        }).setView(cfg.center, 7);
        L.tileLayer(tileServer, {
            attribution: tileAttribution,
            maxZoom: 18
        }).addTo(map);
        d3.select('body').append('div').attr('id', 'main-filter-list');
    }
    map.addLayer(markerclusters);

}

//Ready to go, load the geojson
function getGeoJson() {
    d3.json(geojsonPath, function(error, response) {
        let categories = JSON.parse(response.categories);
        let coptions = _.mapValues(_.keyBy(categories, 'id'), 'lookup');
        let configs = JSON.parse(response.config);
        let source = JSON.parse(response.data);
        let refactor = [];
        source.forEach(function(val) {
            let geoProp = {};
            geoProp["type"] = "Feature";
            geoProp["geometry"] = {
                "type": "Point",
                "coordinates": val["PTS"]
            };
            geoProp["properties"] = val;
            geoProp["properties"]["status"] = "active";
            refactor.push(geoProp);
        });
        let data = {
            "properties": {
                "fields": _.mapValues(_.keyBy(categories, 'id')),
                "attribution": _.find(categories, {
                    'id': categoryField
                }),
                "attributes": categories
            },
            "features": refactor
        }
        localStorage.setItem('default-properties', JSON.stringify(data.properties));
        localStorage.setItem('data', JSON.stringify(data));
        let retrievedObject = localStorage.getItem('data');
        data = JSON.parse(retrievedObject);
        loadData(data, 2);
    });
}

function loadData(allPoints, callType) {
    if (callType === 1) {
        let defaultProp = JSON.parse(localStorage.getItem('default-properties'));
        allPoints.features = _.map(allPoints.features, function(x) {
            x['properties']['status'] = "active";
            return x;
        });
        allPoints.properties = defaultProp;
    }
    geojson = allPoints;
    metadata = allPoints.properties;
    let markers = L.geoJson(geojson, {
        pointToLayer: defineFeature,
        onEachFeature: defineFeaturePopup
    });
    markerclusters.addLayer(markers);
    map.fitBounds(markers.getBounds());
    map.attributionControl.addAttribution(metadata.attribution);
    renderLegend(allPoints);
}

function defineFeature(feature, latlng) {
    if (feature.properties.status === 'active') {
        let categoryVal = feature.properties[categoryField],
            iconVal = feature.properties[iconField];
        let idx_num = _.findIndex(metadata.attribution.lookup, function(el) {
            return el === categoryVal;
        });
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

function defineFeaturePopup(feature, layer) {
    let props = feature.properties,
        fields = metadata.fields,
        popupContent = '';
    popupContent = '<span class="attribute"><span class="label">Name:</span> ' + props[popupFields] + '</span>';
    popupContent = '<div class="map-popup">' + popupContent + '<hr><button href="#" class="btn btn-primary btn-block" onclick="getDetails(this,0)" data="' + props[popupFields] + '"><i class=""></i> View Details</button></div>';
    layer.bindPopup(popupContent, {
        offset: L.point(1, -2)
    });
}


function defineClusterIcon(cluster) {
    let dbs = cluster.getAllChildMarkers();
    dbs = $.map(dbs, function(x) {
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
        .key(function(d) {
            return d.feature.properties[categoryField];
        })
        .entries(children, d3.map),
        //bake some svg markup
        html = bakeThePie({
            data: data,
            valueFunc: function(d) {
                return d.values.length;
            },
            strokeWidth: 1,
            outerRadius: r,
            innerRadius: r - 10,
            pieClass: 'cluster-pie',
            pieLabel: n,
            pieLabelClass: 'marker-cluster-pie-label',
            pathClassFunc: function(d) {
                let idx_num = _.findIndex(metadata.attribution.lookup, function(el) {
                    return el === d.data.key;
                });
				if (idx_num === -1) {
					idx_num = "undefined";
				}
                return "category-" + idx_num;
            },
            pathTitleFunc: function(d) {
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
function bakeThePie(options) {
    /*data and valueFunc are required*/
    if (!options.data || !options.valueFunc) {
        return '';
    }
    let data = options.data,
        valueFunc = options.valueFunc,
        r = options.outerRadius ? options.outerRadius : 28, //Default outer radius = 28px
        rInner = options.innerRadius ? options.innerRadius : r - 10, //Default inner radius = r-10
        strokeWidth = options.strokeWidth ? options.strokeWidth : 1, //Default stroke is 1
        pathClassFunc = options.pathClassFunc ? options.pathClassFunc : function() {
            return '';
        }, //Class for each path
        pathTitleFunc = options.pathTitleFunc ? options.pathTitleFunc : function() {
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
function renderLegend(database) {
    let data = d3.entries(metadata.fields[categoryField].lookup),
        legenddiv = d3.select('body').append('div')
        .attr('id', 'legend');
    let indicators = d3.entries(metadata.attributes);
    $('#legend').append('<select class="custom-select" id="indicators"></select>');
    indicators.forEach(function(s) {
        let selected = '';
        if (s.value.id == metadata.attribution.id) {
            selected = 'selected';
        }
        $('#indicators').append('<option value="' + s.value.id + '$' + s.value.type + '"' + selected + '>' + s.value.name + '</options>');
    });
    let dropdown = d3.select('#indicators');
    dropdown
        .on('change', function(a) {
            let selectedVal = this.value.split('$')[0],
                selectedInd = selectedVal.split('-');
            let dbs = JSON.parse(localStorage.getItem('data'));
            dbs.properties.attribution = dbs.properties.fields[selectedVal];
            localStorage.setItem('data', JSON.stringify(dbs));
            $('#bar-legend').remove();
            localStorage.removeItem('chartPos');
            localStorage.removeItem('filterPos');
            if (dbs.properties.attribution.type === 'list') {
                legenddiv.remove();
                categoryField = selectedVal;
                iconField = categoryField;
                changeValue(dbs, []);
                renderLegend(dbs);
            } else {
                createHistogram();
                categoryField = selectedVal;
                iconField = categoryField;
                changeValue(dbs, []);
            }
        })
    let heading = legenddiv.append('div')
        .classed('legendheading', true)
        .text(metadata.attribution.name);
    $('#legend').append('<hr>');
    let legenditems = legenddiv.selectAll('.legenditem')
        .data(data);
    legenditems
        .enter()
        .append('div')
        .attr('class', function(d) {
            return 'category-' + d.key;
        })
        .attr('data-value', function(d) {
            return d.key;
        })
        .attr('id', function(d) {
            return 'legend-select-' + d.value;
        })
        .on('click', function(d) {
            $('.leaflet-marker-icon').remove();
            if ($(this).hasClass('inactive-legend')) {
                $(this).removeClass('inactive-legend');
                if ($('.inactive-legend').length > 1) {
                    let inactive = $('.inactive-legend').attr('class').split(' ')[0];
                }
            } else {
                $(this).addClass('inactive-legend');
            };
            changeValue(database, getFilterData());
        })
        .classed({
            'legenditem': true
        })
        .text(function(d) {
            return d.value;
        })
}

function getFilterData() {
    let selects = ["1", "2", "3", "4", "5"];
    let deletes = [];
    $('.inactive-legend').each(function() {
        let inactive = $(this).attr('class').split(' ')[0];
        deletes.push(metadata.attribution.lookup[inactive.split('-')[1]]);
    });
    let filterData = $.map(selects, function(x) {
        if (deletes.indexOf(x) >= 0) {
            return;
        }
        return x;
    });
    return deletes;
}

function changeValue(database, deletes) {
    let dbs = JSON.parse(localStorage.getItem('data'));
    dbs["features"] = $.map(dbs.features, function(x) {
        x = x;
        x.properties.status = "active";
        if (deletes.indexOf(x.properties[iconField]) >= 0) {
            x.properties.status = "inactive";
        }
        return x;
    });
    localStorage.setItem('data', JSON.stringify(dbs));
    geojson = dbs;
    metadata = dbs.properties;
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

function filterMaps(minVal, maxVal, attributeName) {
    let dbs = JSON.parse(localStorage.getItem('data'));
    dbs["features"] = $.map(dbs.features, function(x) {
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
    localStorage.setItem('data', JSON.stringify(dbs));
    geojson = dbs;
    metadata = dbs.properties;
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

function createHistogram() {
    let dbs = JSON.parse(localStorage.getItem('data'));
    let attr_name = dbs.properties.attribution.id;
    let barData = dbs.features.map(function(x) {
        let obj = {};
        return {
            'datapoint name': x.properties[cfg.name],
            'indicator': attr_name,
            'value': x.properties[attr_name],
        };
    });
    let dataGroup = _.groupBy(barData, 'value');
    let histogram = _.map(dataGroup, function(v, i) {
        return {
            'len': v.length,
            'val': v[0].value
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
    console.log(attr_name);
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
            position: function(pt) {
                return [pt[0], '100%'];
            },
            formatter: function(param) {
                return param[0]['value'] + ' Datapoints</br>' + variableName + ': ' + param[0]['axisValue'];
            }
        },
        xAxis: {
            min: (chartPos[0] === 0 ? -1 : chartPos[0] - 1),
            name: variableName,
            type: 'category',
            nameGap: 30,
            nameLocation: 'middle',
            data: histogram.map(function(x) {
                return x.val;
            }),
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
            data: histogram.map(function(x) {
                return x.len;
            }),
        }]
    };;
    if (barOption && typeof barOption === "object") {
        myChart.setOption(barOption, true);
    }
    myChart.on('dataZoom', function(a) {
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
function serializeXmlNode(xmlNode) {
    if (typeof window.XMLSerializer != "undefined") {
        return (new window.XMLSerializer()).serializeToString(xmlNode);
    } else if (typeof xmlNode.xml != "undefined") {
        return xmlNode.xml;
    }
    return "";
}

maps = map;
