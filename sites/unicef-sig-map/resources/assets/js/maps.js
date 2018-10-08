import 'leaflet';

$('#stack_search a:nth-child(1)').css('display', 'inline-block');
$('#stack_search a:nth-child(2)').css('display', 'inline-block');
$('#stack_search a:nth-child(3)').css('display', 'inline-block');

var tileServer = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    tileAttribution = 'Map data: <a href="http://openstreetmap.org">OSM</a>'

var geojson,
    metadata,
    geojsonPath = '/api/geojson/',
    categoryField = 'toilets',
    iconField = 'toilets',
    popupFields = ['school_name', 'school_id', 'has_toilet'],
    rmax = 30, //Maximum radius for cluster pies
    markerclusters = L.markerClusterGroup({
        maxClusterRadius: 2 * rmax,
        iconCreateFunction: defineClusterIcon //this is where the magic happens
    }),
    map = L.map('mapid').setView([-8.19, 158.55], 7);


//Add basemap
L.tileLayer(tileServer, {
    attribution: tileAttribution,
    maxZoom: 15
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
        renderLegend();
    } else {
        console.log('Could not load data...');
    }
});

function defineFeature(feature, latlng) {
    var categoryVal = feature.properties[categoryField],
        iconVal = feature.properties[iconField];
    var myClass = 'marker category-' + categoryVal + ' icon-' + iconVal;
    var myIcon = L.divIcon({
        className: myClass,
        iconSize: null
    });
    return L.marker(latlng, {
        icon: myIcon
    });
}

function defineFeaturePopup(feature, layer) {
    var props = feature.properties,
        fields = metadata.fields,
        popupContent = '';
    popupFields.map(function(key) {
        if (props[key]) {
            var val = props[key],
                label = fields[key].name;
            if (fields[key].lookup) {
                val = fields[key].lookup[val];
            }
            popupContent += '<span class="attribute"><span class="label">' + label + ':</span> ' + val + '</span>';
        }
    });
    popupContent = '<div class="map-popup">' + popupContent + '<hr><button href="#" class="btn btn-primary btn-block" onclick="getDetails(this,0)" data="' + props.school_id + '"><i class=""></i> View Details</button></div>';
    layer.bindPopup(popupContent, {
        offset: L.point(1, -2)
    });
}

function defineClusterIcon(cluster) {
    var children = cluster.getAllChildMarkers(),
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
function renderLegend() {
    var data = d3.entries(metadata.fields[categoryField].lookup),
        legenddiv = d3.select('body').append('div')
        .attr('id', 'legend');
    var heading = legenddiv.append('div')
        .classed('legendheading', true)
        .text(metadata.fields[categoryField].name);
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
                var gpath = '/api/geojson/';
                if ($('.inactive-legend').length >= 1) {
                    var inactive = $('.inactive-legend').attr('class').split(' ')[0];
                    gpath = '/api/geojsonfiltered/' + inactive;
                }
            } else {
                $(this).addClass('inactive-legend');
                var gpath = '/api/geojsonfiltered/category-' + d.key;
            };
            if ($('.inactive-legend').length > 1) {
                var multi = [];
                $('.inactive-legend').each(function(a, d) {
                    var inactive = $(this).attr('class').split(' ')[0];
                    inactive = inactive.split('-')[1];
                    multi.push(inactive);
                });
                multi = multi.join('-');
                gpath = '/api/geojsonmulti/' + multi;
            }
            map.removeLayer(markerclusters);
            /* markerclusters.eachLayer(function (ld) {
                if (d.key === ld.feature.properties.toilets){
                    map.removeLayer(ld);
                }
            });
            */
            markerclusters = L.markerClusterGroup({
                maxClusterRadius: 2 * rmax,
                iconCreateFunction: defineClusterIcon
            });
            map.addLayer(markerclusters);
            d3.json(gpath, function(error, dt) {
                if (!error) {
                    geojson = dt;
                    metadata = dt.properties;
                    var markers = L.geoJson(geojson, {
                        pointToLayer: defineFeature,
                        onEachFeature: defineFeaturePopup
                    });
                    markerclusters.addLayer(markers);
                    map.attributionControl.addAttribution(metadata.attribution);
                } else {
                    console.log('Could not load data...');
                }
            });
        })
        .classed({
            'legenditem': true
        })
        .text(function(d) {
            return d.value;
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
