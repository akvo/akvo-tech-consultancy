import 'leaflet';

$('#stack_search a:nth-child(1)').css('display', 'inline-block');
$('#stack_search a:nth-child(2)').css('display', 'inline-block');
$('#stack_search a:nth-child(3)').css('display', 'inline-block');
$('#stack_search a:nth-child(4)').css('display', 'inline-block');

let mkr = [];

$('#change-cluster').on('click', function() {
    var dataCache = JSON.parse(localStorage.getItem('data'));
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

var tileServer = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    tileAttribution = 'Tiles © Wikimedia — Source: OpenStreetMap, Data: Unicef Pacific WASH, <a href="https://akvo.org">Akvo SEAP</a>';

d3.select('body').append('div').attr('id', 'main-filter-list');
var provinceList;
d3.json('/api/province', function(error, data) {
    provinceList = data;
    $('#province-filter').css('display', 'inline-block');
    d3.select('#main-filter-list').append('div').attr('class', 'legendprovince').text('Province');
    d3.select('#main-filter-list').append('div').attr('id', 'province-list');
    provinceList.forEach(function(x) {
        var provinceId = x.split(' ');
        provinceId = provinceId.join('_');
        d3.select('#province-list')
            .append('a')
            .attr('id', 'province-' + provinceId)
            .text(x)
            .on('click', function(a) {
                filterProvSchool(x, provinceId, 'province');
            });
    });
    d3.select('#province-list').append('button')
        .attr('class', 'btn')
        .attr('id', 'province-all')
        .attr('data-select', 'remove')
        .text('Disable All')
        .on('click', function(a) {
            filterProvSchool('options', 'all', 'province');
        });
    $('.legendprovince').click(function(e) {
        $('#province-list').slideToggle();
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        } else {
            $(this).addClass('active');
            if($('.legendschooltype').hasClass('active')){
                $('.legendschooltype').click();
            };
        }

    });
});

var schoolTypeList;
d3.json('/api/school-type', function(error, data) {
    schoolTypeList = data;
    $('#school-type-filter').css('display', 'inline-block');
    d3.select('#main-filter-list').append('h3').attr('class', 'legendschooltype').text('School Type');
    d3.select('#main-filter-list').append('div').attr('id', 'school-type-list');
    schoolTypeList.forEach(function(x) {
        var schoolTypeId = x.split(' ');
        schoolTypeId = schoolTypeId.join('_');
        d3.select('#school-type-list')
            .append('a')
            .attr('id', 'school-type-' + schoolTypeId)
            .text(x)
            .on('click', function(a) {
                filterProvSchool(x, schoolTypeId, 'school-type');
            });
    });
    d3.select('#school-type-list').append('button')
        .attr('class', 'btn')
        .attr('id', 'school-type-all')
        .attr('data-select', 'remove')
        .text('Disable All')
        .on('click', function(a) {
            filterProvSchool('options', 'all', 'school-type');
        });
    $('.legendschooltype').click(function(e) {
        $('#school-type-list').slideToggle();
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        } else {
            $(this).addClass('active');
            if($('.legendprovince').hasClass('active')){
                $('.legendprovince').click();
            };
        }

    });
});

function filterProvSchool(dataName, dataId, type) {
    var dbs = JSON.parse(localStorage.getItem('data'));
    if (dataName === 'options') {
        var dataSelection = $('#'+type+'-all').attr('data-select');
        if (dataSelection === 'add') {
            $('#'+type+'-list > a').removeClass('inactive');
            $('#'+type+'-all').removeClass('enable-all');
            $('#'+type+'-all').text('Disable All');
            $('#'+type+'-all').attr('data-select', 'remove');
        } else {
            $('#'+type+'-list > a').addClass('inactive');
            $('#'+type+'-all').addClass('enable-all');
            $('#'+type+'-all').text('Enable All');
            $('#'+type+'-all').attr('data-select', 'add');
        }
    } else {
        $('#'+type+'-all').addClass('enable-all');
        $('#'+type+'-all').text('Enable All');
        $('#'+type+'-all').attr('data-select', 'add');
    }
    dbs["features"] = $.map(dbs.features, function(x) {
        x = x;
        if (dataName === 'options') {
            if (dataSelection === 'add') {
                x.properties[type + '-master'] = 'active';
            } else {
                x.properties[type + '-master'] = 'inactive';
            }
        } else {
            if (x.properties[type] === dataName) {
                if (x.properties[type + '-master']=== "active") {
                    x.properties[type + '-master']= "inactive";
                    $('#' + type + '-' + dataId).addClass('inactive');
                } else {
                    x.properties[type + '-master'] = "active";
                    $('#' + type + '-' + dataId).removeClass('inactive');
                }
            }
        }
        return x;
    });
    localStorage.setItem('data', JSON.stringify(dbs));
    dbs = JSON.parse(localStorage.getItem('data'));
    metadata = dbs.properties;
    if (clustered === true) {
        map.removeLayer(markerclusters);
        if (metadata.attribution.type === 'num') {
            $('#bar-legend').remove();
            createHistogram();
        } else {
            changeValue(dbs, getFilterData());
        };
    } else {
        map.removeLayer(mkr);
        mkr = L.geoJson(dbs, {
            pointToLayer: defineFeature,
            onEachFeature: defineFeaturePopup
        });
        map.addLayer(mkr);
        map.attributionControl.addAttribution(metadata.attribution);
    }
};

var geojson,
    metadata,
    clustered = true,
    geojsonPath = '/api/geojson/',
    categoryField = 'toilet-type',
    iconField = categoryField,
    popupFields = ['school_name', 'school_id'],
    rmax = 30, //Maximum radius for cluster pies
    selects = ["1", "2", "3", "4", "5"],
    markerclusters = L.markerClusterGroup({
        maxClusterRadius: 2 * rmax,
        iconCreateFunction: defineClusterIcon //this is where the magic happens
    }),
    map = L.map('mapid').setView([-8.3626894, 160.3288342], 7);

//Add basemap
L.tileLayer(tileServer, {
    attribution: tileAttribution,
    maxZoom: 18
}).addTo(map);

//and the empty markercluster layer
map.addLayer(markerclusters);

//Ready to go, load the geojson
d3.json(geojsonPath, function(error, data) {
    localStorage.setItem('data', JSON.stringify(data));
    var retrievedObject = localStorage.getItem('data');
    data = JSON.parse(retrievedObject);
    if (!error) {
        geojson = data;
        metadata = data.properties;
        var markers = L.geoJson(geojson, {
            pointToLayer: defineFeature,
            onEachFeature: defineFeaturePopup
        });
        markerclusters.addLayer(markers);
        map.fitBounds(markers.getBounds());
        map.attributionControl.addAttribution(metadata.attribution);
        renderLegend(data);
    } else {
        console.log('Could not load data...');
    }
});

function defineFeature(feature, latlng) {
    if (feature.properties.status === 'active' && feature.properties['province-master'] === 'active' && feature.properties['school-type-master'] === 'active') {
        var categoryVal = feature.properties[categoryField],
            iconVal = feature.properties[iconField];
        var myClass = 'marker category-' + categoryVal + ' icon-' + iconVal;
        var iconSize = null;
        if (!clustered) {
            iconSize = 10;
        }
        var myIcon = L.divIcon({
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
    var props = feature.properties,
        fields = metadata.fields,
        popupContent = '';
    popupContent = '<span class="attribute"><span class="label">School Name:</span> ' + props.school_name + '</span>';
    popupContent += '<span class="attribute"><span class="label">School Type:</span> ' + props['school-type'] + '</span>';
    popupContent += '<span class="attribute"><span class="label">Province:</span> ' + props.province + '</span>';
    popupContent = '<div class="map-popup">' + popupContent + '<hr><button href="#" class="btn btn-primary btn-block" onclick="getDetails(this,0)" data="' + props.school_id + '"><i class=""></i> View Details</button></div>';
    layer.bindPopup(popupContent, {
        offset: L.point(1, -2)
    });
}


function defineClusterIcon(cluster) {
    var dbs = cluster.getAllChildMarkers();
    dbs = $.map(dbs, function(x) {
        if (x.feature.properties.status === 'active') {
            return x;
        }
        return;
    });
    var children = dbs,
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
                return "category-" + d.data.key;
            },
            pathTitleFunc: function(d) {
                return metadata.fields[categoryField].lookup[d.data.key] + ' (' + d.data.values.length + ' accident' + (d.data.values.length != 1 ? 's' : '') + ')';
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
    var data = options.data,
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
    var svg = document.createElementNS(d3.ns.prefix.svg, 'svg');

    //Create the pie chart
    var vis = d3.select(svg)
        .data([data])
        .attr('class', pieClass)
        .attr('width', w)
        .attr('height', h);
    var arcs = vis.selectAll('g.arc')
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
    var data = d3.entries(metadata.fields[categoryField].lookup),
        legenddiv = d3.select('body').append('div')
        .attr('id', 'legend');
    var indicators = d3.entries(metadata.attributes);
    $('#legend').append('<select class="custom-select" id="indicators"></select>');
    indicators.forEach(function(x) {
        $('#indicators').append('<optgroup id="' + x.value.id + '" label="' + x.value.name + '"></optgroup>');
        x.value.collection.forEach(function(s) {
            var selected = '';
            if (s.id == metadata.attribution.id) {
                selected = 'selected';
            }
            $('#' + x.value.id).append('<option value="' + s.id + '$' + s.type + '"' + selected + '>' + s.name + '</options>');
        });
    });
    var dropdown = d3.select('#indicators');
    dropdown
        .on('change', function(a) {
            var selectedVal = this.value.split('$')[0],
                selectedInd = selectedVal.split('-');
            var dbs = JSON.parse(localStorage.getItem('data'));
            dbs.properties.attribution.id = selectedInd.join('-');
            dbs.properties.attribution.name = selectedInd.join(' ');
            dbs.properties.attribution.type = this.value.split('$')[1];
            localStorage.setItem('data', JSON.stringify(dbs));
            $('#bar-legend').remove();
            localStorage.removeItem('chartPos');
            localStorage.removeItem('filterPos');
            if (dbs.properties.attribution.type === 'str') {
                legenddiv.remove();
                categoryField = selectedVal,
                    iconField = categoryField,
                    changeValue(dbs, []);
                renderLegend(dbs);
            } else {
                createHistogram();
                categoryField = "neutral",
                    iconField = categoryField,
                    changeValue(dbs, []);
            }
        })
    var heading = legenddiv.append('div')
        .classed('legendheading', true)
        .text(metadata.attribution.name);
    $('#legend').append('<hr>');
    var legenditems = legenddiv.selectAll('.legenditem')
        .data(data);
    legenditems
        .enter()
        .append('div')
        .attr('class', function(d) {
            return 'category-' + d.key;
        })
        .on('click', function(d) {
            $('.leaflet-marker-icon').remove();
            if ($(this).hasClass('inactive-legend')) {
                $(this).removeClass('inactive-legend');
                if ($('.inactive-legend').length > 1) {
                    var inactive = $('.inactive-legend').attr('class').split(' ')[0];
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
        });
}

function getFilterData() {
    var selects = ["1", "2", "3", "4", "5"];
    var deletes = [];
    $('.inactive-legend').each(function() {
        var inactive = $(this).attr('class').split(' ')[0];
        deletes.push(inactive.split('-')[1]);
    });
    var filterData = $.map(selects, function(x) {
        if (deletes.indexOf(x) >= 0) {
            return;
        }
        return x;
    });
    return deletes;
}

function changeValue(database, deletes) {
    var dbs = JSON.parse(localStorage.getItem('data'));
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
        var markers = L.geoJson(dbs, {
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
    var dbs = JSON.parse(localStorage.getItem('data'));
    dbs["features"] = $.map(dbs.features, function(x) {
        x = x;
        x.properties.status = "inactive";
        if (x.properties[attributeName] >= minVal && x.properties[attributeName] <= maxVal || x.properties[attributeName] === maxVal) {
            x.properties.status = "active";
        }
        if (x.properties[attributeName] === 0) {
            x.properties.status = "inactive";
        }
        return x;
    });
    localStorage.setItem('data', JSON.stringify(dbs));
    geojson = dbs;
    metadata = dbs.properties;
    if (clustered === true) {
        map.removeLayer(markerclusters);
        markerclusters = L.markerClusterGroup({
            maxClusterRadius: 2 * rmax,
            iconCreateFunction: defineClusterIcon
        });
        map.addLayer(markerclusters);
        var markers = L.geoJson(dbs, {
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
    var dbs = JSON.parse(localStorage.getItem('data'));
    var attr_name = dbs.properties.attribution.name;
    var barData = dbs.features.map(function(x) {
        var obj = {};
        return {
            'school_name': x.properties['school_name'],
            'indicator': attr_name,
            'value': x.properties[attr_name],
            'master': x.properties['school-type-master']+ '_' + x.properties['province-master']
        };
    });
    barData = _.remove(barData, function(n) {
        return n['master'] === "active_active";
    });
    let dataGroup = _.groupBy(barData, 'value');
    let histogram = _.map(dataGroup, function(v, i) {
        return {
            'len': v.length,
            'val': v[0].value
        };
    });
    histogram = _.orderBy(histogram, ['val', 'len'], ['asc', 'desc']);
    histogram = _.remove(histogram, function(n) {
        return n.val !== 0;
    });
    var barlegenddiv = d3.select('body').append('div')
        .attr('id', 'bar-legend');
    var heading = barlegenddiv.append('div')
        .classed('legendheading', true)
        .text(attr_name);
    $('.legenditem').remove();
    $('.legendheading').remove();
    $('#legend > hr').remove();
    $('#legend').css('box-shadow', 'None');
    $('#legend').css('-webkit-box-shadow', 'None');
    var dom = document.getElementById("bar-legend");
    var myChart = echarts.init(dom);
    var app = {};
    var chartPos = JSON.parse(localStorage.getItem('chartPos'));
    if (chartPos === null) {
        chartPos = [0, 100];
        filterMaps(0, 100, attr_name);
    } else {
        let filterPos = JSON.parse(localStorage.getItem('filterPos'));
        filterMaps(filterPos[0], filterPos[1], attr_name);
    }
    var barOption = {
        title: {
            center: 'left',
            top: 10,
            textStyle: {
                fontFamily: 'Roboto',
            },
            text: dbs.properties.attribution.name.replace(/_/g, ' ').toUpperCase(),
        },
        tooltip: {
            trigger: 'axis',
            position: function(pt) {
                return [pt[0], '100%'];
            },
            axisPointer : {
                type: 'shadow'
            },
            formatter: function(param) {
                return param[0]['value'] + ' Schools</br>' + param[0]['axisValue'] + ' ' + dbs.properties.attribution.name.replace(/_/g, ' ');
            }
        },
        xAxis: {
            offset: 0.1,
            name: attr_name.replace(/_/g, " ").toUpperCase(),
            type: 'category',
            nameGap: 30,
            nameLocation: 'middle',
            data: histogram.map(function(x) {
                return x.val;
            }),
            boundaryGap: false,
        },
        yAxis: {
            name: 'TOTAL OF SCHOOL',
            nameLocation: 'middle',
            nameGap: 25,
            type: 'value',
            boundaryGap: [0, '100%']
        },
        dataZoom: [{
            type: 'slider',
            start: chartPos[0],
            end: chartPos[1],
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '100%',
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
            smooth: true,
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
        var axis = myChart.getModel().option.xAxis[0];
        var minVal = axis.data[axis.rangeStart];
        var maxVal = axis.data[axis.rangeEnd];
        var newPos = [a.start, a.end];
        localStorage.setItem('chartPos', JSON.stringify(newPos));
        if (typeof minVal === 'undefined') {
            console.log(axis);
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
