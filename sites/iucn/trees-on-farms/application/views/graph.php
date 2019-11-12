<?php
$admin_organ_types = array();
if (isset($admin_organs)){
    foreach ($admin_organs as $admin_organ){
        if (!in_array($admin_organ['type'], $admin_organ_types)){
            array_push($admin_organ_types, $admin_organ['type']);
        }
    }
    $col_size = round((12/count($admin_organ_types)), 0, PHP_ROUND_HALF_DOWN);
}
?>

<div class="row">
	<div class="col-md-12" id="loading_animation" style="text-align: center; display: block"><img alt="Loading" src="<?=base_url()?>resources/images/ajax-loader.gif"></div>
</div>
<div class="row">
	<div class="col-md-3"> <!-- Filters -->
		<?php foreach ($admin_organ_types as $admin_organ_type):?>
    <div class="form-group">
			<select class="form-control input-md selectpicker" name="<?=$admin_organ_type?>" id="<?=$admin_organ_type?>">
				<option value="">--Country--</option>
			</select>
		</div>
    <?php endforeach;?>
	</div>
</div>
<div class="row">
	<div class="col-md-7">
		<div id="map" class="col-md-12"></div>
		<p><label>Data source: <a href="https://iucn.akvoflow.org" target="_blank">Akvo Flow</a></label></p>
		<div class="col-md-12" style="max-height: 500px; overflow:auto">
			<table class="table">
    			<thead>
    				<tr>
    					<th>Submitter</th>
        				<th>Country</th>
        				<th>Date</th>
<?php switch ($page): ?>
<?php case 'activities': ?>
<th>Activity type</th>
<?php break; ?>
<?php case 'results': ?>
<th>Link to result framework</th>
<?php break; ?>
<?php endswitch ?>
    				</tr>
    			</thead>
    			<tbody id="table-data"></tbody>
    		</table>
		</div>
	</div>
	<div class="col-md-5" id="graph">
		<div class="panel-group" id="accordion">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h4 class="panel-title">
		                <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#timeline">Timeline</a>
					</h4>
				</div>
				<div id="timeline" class="panel-collapse collapse in">
					<div class="panel-body">
						<div class="chart" id="timeline-graph"></div>
					</div>
				</div>
		    </div>
		<?php
		$charts = $visualisation_details[$page]['columns'];
		foreach ($charts as $key => $column):?>
			<div class="panel panel-default">
				<div class="panel-heading">
					<h4 class="panel-title">
		                <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#<?=$key?>"><?=$column['title']?></a>
					</h4>
				</div>
				<div id="<?=$key?>" class="panel-collapse collapse">
					<div class="panel-body">
						<div class="chart" id="chart-<?=$key?>"></div>
					</div>
				</div>
		    </div>
		<?php endforeach;?>
		</div>
	</div> <!-- Graph -->
</div>

<!-- Modal -->
<div id="modalInfobox" class="modal fade" role="dialog">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">&times;</button>
				<h4 class="modal-title" id="point-title"></h4>
			</div>
			<div class="modal-body">
				<ul class="nav nav-tabs" id="forms-nav"></ul>
				<div class="tab-content" id="point-content"></div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</div>
<a class="open-modal-infobox" data-toggle="modal" data-target="#modalInfobox"></a>
<!-- End modal -->

<!-- Carto info windows -->
<script type="infowindow/html" id="iucn-infowindow">
<div class="cartodb-popup v2">
    <a href="#close" class="cartodb-popup-close-button close">x</a>
    <div class="cartodb-popup-content-wrapper">
        <div class="cartodb-popup-content">
            <!-- content.data contains the field info -->
            <h4>{{content.data.q4800002}}</h4>
            <label>Submitted by {{content.data.submitter}}</label>
        </div>
    </div>
    <div class="cartodb-popup-tip-container"></div>
</div>
</script>
<!-- End Carto info window -->

<script type="text/javascript">
var map, selectedFilter="", selectedFilterText="";
var admin_organs = <?=(isset($admin_organs) ? json_encode($admin_organs) : '[]')?>;
var levels = <?=json_encode($levels)?>;
$("#<?=$page?>_link").addClass('active');

$.ajaxSetup({
	beforeSend: function(){
		$("#loading_animation").show();
    },
	complete: function(){
		$("#loading_animation").hide();
    }
});

$( document ).ready(function() {
	admin_organs.sort(function(el1, el2){
		return compare(el1, el2, "name")
	});

	<?php if (!empty($admin_organ_types)):?>
	for (var i=0; i<admin_organs.length; i++){
		if (admin_organs[i].type == '<?=$admin_organ_types[0]?>'){
			$("#<?=$admin_organ_types[0]?>").append('<option value="'+convertToSlug(admin_organs[i].name)+'">'+admin_organs[i].name+'</option>');
		}
	}
	$('.selectpicker').selectpicker('refresh');
	<?php endif;?>

	map = L.map('map', {/*scrollWheelZoom: false*/}).setView([0, 0], 0);

	var mbAttr = 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>',
	mbUrl = 'https://{s}.{base}.maps.cit.api.here.com/maptile/2.1/maptile/{mapID}/{scheme}/{z}/{x}/{y}/256/{format}?app_id={app_id}&app_code={app_code}';

	var normal = L.tileLayer(mbUrl, {
		scheme: 'normal.day.transit',
		format: 'png8',
		attribution: mbAttr,
		subdomains: '1234',
		mapID: 'newest',
		app_id: 'DC0jMgnvlRs54v4XvyBV',
		app_code: '3PNibIUvykZ8RK-nD_dh4Q',
		base: 'base'
	}).addTo(map),
	satellite  = L.tileLayer(mbUrl, {
		scheme: 'hybrid.day',
		format: 'jpg',
		attribution: mbAttr,
		subdomains: '1234',
		mapID: 'newest',
		app_id: 'DC0jMgnvlRs54v4XvyBV',
		app_code: '3PNibIUvykZ8RK-nD_dh4Q',
		base: 'aerial'
	});

	var baseLayers = {
		"Normal": normal,
		"Satellite": satellite
	};

	L.control.layers(baseLayers).addTo(map);

	cartodb.createLayer(map, {
	    user_name: 'akvo',
	    type: 'cartodb',
	    sublayers: [{
		    sql: "SELECT * FROM tof_28030003 WHERE q4800002 ='<?=$visualisation_details[$page]['event_type']?>'",
		    cartocss: '#tof_28030003 {'
		    	+'marker-fill: #012700;'
			    +'marker-fill-opacity: 0.9;'
			    +'marker-line-color: #FFF;'
			    +'marker-line-width: 1;'
			    +'marker-line-opacity: 1;'
			    +'marker-placement: point;'
			    +'marker-type: ellipse;'
			    +'marker-width: 10;'
			    +'marker-allow-overlap: true;'
			    +'}'
			    +'#tof_28030003[q10170002=\'Honduras\'] {'
			    +'marker-fill: #175fce;'
			    +'}'
			    +'#tof_28030003[q10170002=\'Indonesia\'] {'
			    +'marker-fill: #f77647;'
			    +'}'
			    +'#tof_28030003[q10170002=\'Peru\'] {'
			    +'marker-fill: #bc000f;'
			    +'}'
			    +'#tof_28030003[q10170002=\'Rwanda\'] {'
			    +'marker-fill: #20603d;'
			    +'}'
			    +'#tof_28030003[q10170002=\'Uganda\'] {'
			    +'marker-fill: #fedb07;'
			    +'}'
			    +'#tof_28030003[q10170002=\'Global\'] {'
			    +'marker-fill: #42f4eb;'
			    +'}'
			    +'#tof_28030003[q4800002=\'Intended or unexpected Result\'] {'
                +'marker-file: url(<?=base_url()?>/resources/images/black.svg);'
			    +'}'/**/,
			interactivity: '<?=implode(", ", $visualisation_details[$page]['map_interactivity'])?>'
		}],
		tooltip: false
	})
	.addTo(map, 1)
	.done( function(layer) {
		//do stuff
		layer.setZIndex(1000); //required to ensure that the cartodb layer is not obscured by the here maps base layers

		fitMapToLayer("SELECT * FROM tof_28030003 WHERE q4800002 ='<?=$visualisation_details[$page]['event_type']?>'");

		addCursorInteraction(layer);

		dataLayer = layer.getSubLayer(0);

		dataLayer.setInteraction(true);
		dataLayer.set({'interactivity': '<?=implode(", ", $visualisation_details[$page]['map_interactivity'])?>'});
		cdb.vis.Vis.addInfowindow(map, layer.getSubLayer(0), <?=json_encode($visualisation_details[$page]['map_interactivity'])?>, {
			infowindowTemplate: $('#iucn-infowindow').html()
		});

		dataLayer.on('featureClick', function(e, latlng, pos, data) {
			getPointData(data);
		});
	})
	.error( function(err) {
	  console.log("some error occurred: " + err);
	});

	getChartsData();
});

<?php foreach ($admin_organ_types as $key => $admin_organ_type):?>
$( "#<?=$admin_organ_type?>" ).change(function(){
	<?php
	$current_key = $key+1;
	foreach ($admin_organ_types as $i => $type):
	if ($current_key == $i):?>
	$("#<?=$admin_organ_types[$current_key]?> option[value!='']").remove();
	<?php
	$current_key++;
	endif;
	endforeach;?>

	if ($( "#<?=$admin_organ_type?>" ).val() != "") {
		<?php if (count($admin_organ_types) > 1 && $key+1 < count($admin_organ_types)):?>
		for (var i=0; i<admin_organs.length; i++){
			if (admin_organs[i].type == '<?=$admin_organ_types[$key+1]?>' && admin_organs[i].parent == $( "#<?=$admin_organ_types[$key]?> option:selected" ).text()){
				$("#<?=$admin_organ_types[$key+1]?>").append('<option value="'+convertToSlug(admin_organs[i].name)+'">'+admin_organs[i].name+'</option>');
			}
		}
		<?php endif;?>
		selectedFilter = "<?=$admin_organ_types[$key]?>";
		selectedFilterText = $("#<?=$admin_organ_types[$key]?> option:selected").text();

		LayerActions['<?=$admin_organ_types[$key]?>']();
	} else {
		//call function to filter map layer and draw chart
		<?php if ($key == 0):?>
		selectedFilter = "";
		selectedFilterText = "";

		LayerActions['all']();
		<?php else:?>
		selectedFilter = "<?=$admin_organ_types[$key-1]?>";
		selectedFilterText = $("#<?=$admin_organ_types[$key-1]?> option:selected").text();

		LayerActions['<?=$admin_organ_types[$key-1]?>']();
		<?php endif;?>
	}
	$('.selectpicker').selectpicker('refresh');

	getChartsData();
});
<?php endforeach;?>

$("#event-type").change(function(){
	getChartsData();
	if ($("#country").val() != "") {
		LayerActions['country']();
	} else {
		LayerActions['all']();
	}
});

var LayerActions = {
		all: function(){
			var query = "SELECT * FROM tof_28030003 WHERE q4800002 ='<?=$visualisation_details[$page]['event_type']?>'";
			dataLayer.setSQL(query);

			fitMapToLayer(query);
			return true;
		}<?php foreach ($admin_organ_types as $admin_organ_type):?>,
		<?=$admin_organ_type?>: function(){
			var query = "SELECT * FROM tof_28030003 WHERE q4800002 ='<?=$visualisation_details[$page]['event_type']?>' AND q10170002 LIKE '%"+$( "#<?=$admin_organ_type?> option:selected" ).text()+"%'";
			dataLayer.setSQL(query);

			fitMapToLayer(query);
			return true;
		}
		<?php endforeach;?>
};

/*fit map to bounds*/
function fitMapToLayer (query) {
	var sql = new cartodb.SQL({ user: 'akvo' });
    sql.getBounds(query).done(function(bounds) {
      map.fitBounds(bounds)
    });
}
/*end fit map to bounds*/

function getPointData (data) {
  $.get(
    "<?=base_url()?>index.php/point-data/"+data.identifier+"/<?=$visualisation_details[$page]['survey_group_id']?>",
    function(dt, status){
      var formsOrder = <?=json_encode($visualisation_details[$page]['forms'])?>, orderedDt = {};
      for (var i=0; i<formsOrder.length; i++) {
        orderedDt[formsOrder[i]] = dt[formsOrder[i]];
      }

      var formCount = 0;
      moreInfoLink = $(".open-modal-infobox");
      moreInfoLink.click();
      $("#forms-nav").html("");
      $("#point-content").html("");
      $("#point-title").html(data.<?=$visualisation_details[$page]['popup_title']?>);
      for (form in orderedDt) {
        $("#forms-nav").append("<li class=\""+((formCount === 0) ? 'active' : '')
            +"\"><a href=\"#form-"+formCount+"\" data-toggle=\"tab\">"+form+"</a></li>");

        //create accordion to hold the instances
        $("#point-content").append("<div class=\"tab-pane "+((formCount === 0) ? 'active' : '')+"\" id=\"form-"+formCount+"\">&nbsp;</div>");
        $("#form-"+formCount).html("<div class=\"panel-group\" id=\"accordion-"+formCount+"\"></div>");

        //for every instance in the form, add
        var instanceCount = 0;
        for (instance in orderedDt[form]) {
          var date = new Date(parseInt(instance));
          var collectionYear = date.getFullYear();
          var collectionMonth = ("0"+(date.getMonth() + 1)).slice(-2);
          var collectionDay = ("0"+date.getDate()).slice(-2);
          var collectionDate = collectionDay+"-"+collectionMonth+"-"+collectionYear;

          var answers = "";
          for (var i=0; i<orderedDt[form][instance].length; i++) {
            answers += "<tr><td><b>"+orderedDt[form][instance][i]['questionText']+":</b> </td><td>";
            switch (orderedDt[form][instance][i]['type']) {
              case "CASCADE":
                var cascadeString = "", cascadeJson;
                            if (orderedDt[form][instance][i]['value'].charAt(0) === '[') {
                              cascadeJson = JSON.parse(orderedDt[form][instance][i]['value']);
                              cascadeString = cascadeJson.map(function(item){
                                return item.name;
                              }).join("|");
                            } else {
                              cascadeString = orderedDt[form][instance][i]['value'];
                            }
                            answers += cascadeString;
                break;
              case "IMAGE":
                var mediaString = "", mediaJson = "", mediaFilename = "", mediaObject = {};
                            if (orderedDt[form][instance][i]['value'].charAt(0) === '{') {
                              mediaJson = JSON.parse(orderedDt[form][instance][i]['value']);
                              mediaString = mediaJson.filename;
                            } else {
                              mediaString = orderedDt[form][instance][i]['value'];
                            }
                            answers += '<img style=\"width: 100%\" src="https://akvoflow-165.s3.amazonaws.com/images/'+mediaString.substring(mediaString.lastIndexOf("/")+1)+'"/>';
                break;
              case "SIGNATURE":
                answers += '<img style=\"width: 100%\" src="';
                            var srcAttr = 'data:image/png;base64,', signatureJson;
                            signatureJson = JSON.parse(orderedDt[form][instance][i]['value']);
                            answers += srcAttr + signatureJson.image +'"/>';
                            answers += '<label>Signed by: '+signatureJson.name+'</label>';
                break;
              default:
                answers += orderedDt[form][instance][i]['value'];
                break;
            }
            answers += "</td></tr>";
          }
          $("#accordion-"+formCount).append(
              "<div class=\"panel panel-default\">"
              +"<div class=\"panel-heading\">"
              +"<h4 class=\"panel-title\">"
              +"<a class=\"accordion-toggle\" data-toggle=\"collapse\" data-parent=\"#accordion-"+formCount+"\" href=\"#"+instance+"\">"+collectionDate+"</a>"
              +"</h4>"
              +"</div>"
              +"<div id=\""+instance+"\" class=\"panel-collapse collapse"+((instanceCount == 0) ? ' in': '')+"\">"
              +"<div class=\"panel-body\">"
              //question-answer logic goes here
              +"<div class=\"table-responsive\"><table class=\"table table-condensed\">"+answers+"</table></div>"
              +"</div>"
              +"</div>"
              +"</div>"
              );
          instanceCount++;
        }
        formCount++;
      }
    });
}

function getChartsData () {
	var queryData = {};
	queryData['filter'] = selectedFilter;
	queryData['filter_value'] = selectedFilterText;
	queryData['report_on'] = '<?=$visualisation_details[$page]['event_type']?>';

	$.post(
			"<?=base_url()?>index.php/timeline-graph-data",
			queryData,
			function(data, status){
				//plot graph
				drawTimelineGraph(data);
			});

	$.post(
			"<?=base_url()?>index.php/table-data",
			queryData,
			function(data, status){
				//load table
				populateTable(data);
			});

	<?php
  $fields = array();
  $gauges = array();
  foreach ($visualisation_details[$page]['columns'] as $key => $cat) {
    if (array_key_exists('cols', $cat)) {
      if (!array_key_exists($key, $gauges)) $gauges[$key] = array();
      foreach ($cat['cols'] as $col => $details) {
        array_push($gauges[$key], $col);
      }
    } else {
      array_push($fields, $key);
    }
  }?>
  queryData['fields'] = <?=json_encode($fields)?>;
  queryData['gauges'] = <?=json_encode($gauges)?>;
  queryData['survey'] = '<?=$visualisation_details[$page]['table']?>';
	$.post(
			"<?=base_url()?>index.php/charts-data",
			queryData,
			function(data, status){
				drawCharts(data);
			});
}

function populateTable(data) {
	var cols = {
			"submitter": "Submitter",
      "q10170002": "Country",
			"collection_date": "Date",
<?php switch ($page): ?>
<?php case 'activities': ?>
"q20080001": "Activity type"
<?php break; ?>
<?php case 'results': ?>
"q670002": "Link to result framework"
<?php break; ?>
<?php endswitch ?>
	}
	$("#table-data").html("")
	for (var i=0; i<data.length; i++) {
		var row = "<tr>";
    var d = new Date(parseInt(data[i]["collection_date"]));
    var date = ("0"+d.getDate()).slice(-2)+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+d.getFullYear()+" "+("0"+d.getHours()).slice(-2)+":"+("0"+d.getMinutes()).slice(-2);
		for (obj in data[i]) {
			row += "<td>"+(obj == "collection_date" ? date : (data[i][obj] ? data[i][obj] : ""))+"</td>";
		}
		row += "</tr>";
		$("#table-data").append(row);
	}
}

function drawTimelineGraph(data){
	$('#timeline-graph').highcharts({
		chart: {
	        type: 'scatter',
	        zoomType: 'xy'
	    },
	    title: {
	        text: 'Scale timeline'
	    },
	    subtitle: {
	        text: 'Source: Akvo Flow'
	    },
	    xAxis: {
	        title: {
	            enabled: true,
	            text: 'Date'
	        },
	        type: 'datetime',
	        startOnTick: true,
	        endOnTick: true,
	        showLastLabel: true
	    },
	    yAxis: {
	        title: {
	            text: 'Level'
	        },
	        categories: levels
	    },
	    tooltip: {
	    		formatter: function() {
                return '<b>Submitted by ' + this.point.name +'</b><br/>' +
                    Highcharts.dateFormat('%e-%b-%Y', new Date(this.x));
            }
		},
	    plotOptions: {
	        scatter: {
	            marker: {
	                radius: 5,
	                states: {
	                    hover: {
	                        enabled: true,
	                        lineColor: 'rgb(100,100,100)'
	                    }
	                },
	                symbol: "circle"
	            },
	            states: {
	                hover: {
	                    marker: {
	                        enabled: false
	                    }
	                }
	            },
	            tooltip: {
	                headerFormat: '<b>{series.name}</b><br>'
	            },
              cursor: 'pointer',
              events: {
                click: function(e) {
                  var data = {
                    identifier: e.point.identifier,
                    q4800002: e.point.q4800002
                  };
                  getPointData(data);
                }
              }
	        }
	    },
	    series: data,
	    legend: {
          enabled: true
      }
    });
}

function drawCharts(data){
	var charts = <?=json_encode($charts)?>;

	for (chartObj in charts) {
    var chartData;
		switch (charts[chartObj]['type']) {
      case "vbar":
        chartData = {};
        chartData['name'] = charts[chartObj]['title'];
        chartData['data'] = [];
        for (obj in data[chartObj]) {
          chartData['data'].push([obj, data[chartObj][obj]]);
        }

        $('#chart-'+chartObj).highcharts({
          chart: {
            type: 'column'
          },
          title: {
            text: charts[chartObj]['title']
          },
          subtitle: {
              text: 'Source: Akvo Flow'
          },
          yAxis: {
              min: 0,
              title: {
                  text: 'Count'
              }
          },
          xAxis: {
              type: 'category',
              labels: {
                  rotation: -45,
                  style: {
                      fontSize: '11px',
                      fontFamily: 'Verdana, sans-serif'
                  }
              }
          },
          legend: {
              enabled: false
          },
          tooltip: {
              pointFormat: '<b>{point.y:.0f} point(s)</b>'
          },
          plotOptions: {
              column: {
                  pointPadding: 0.2,
                  borderWidth: 0
              }
          },
          series: [chartData]
        });
        break;
      case "gauge":
        var panes=[], chartData=[], count=2, innerRadius=38, outerRadius=62;
        for (obj in data[chartObj]) {
          panes.push({
            outerRadius: (outerRadius == 62 ? 62 : outerRadius)+'%',
            innerRadius: (innerRadius == 38 ? 38 : innerRadius)+'%',
            backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[count])
                .setOpacity(0.3)
                .get(),
            borderWidth: 0
          });
          chartData.push({
            name: charts[chartObj]['cols'][obj]['title'],
            color: Highcharts.getOptions().colors[count],
            target: charts[chartObj]['cols'][obj]['target'],
            data: [{
              color: Highcharts.getOptions().colors[count],
              radius: outerRadius+'%',
              innerRadius: innerRadius+'%',
              y: parseFloat(((data[chartObj][obj]/(charts[chartObj]['cols'][obj]['target']/($('#country').val() ? 5 : 1)))*100).toFixed(2)),
              count: parseInt(data[chartObj][obj])
            }],
            showInLegend: true
          });
          innerRadius += 25;
          outerRadius += 25;
          count++;
        }

        $('#chart-'+chartObj).highcharts({
            chart: {
                type: 'solidgauge',
                marginTop: 50
            },

            title: {
                text: charts[chartObj]['title'],
                style: {
                    fontSize: '24px'
                }
            },

            tooltip: {
                borderWidth: 0,
                backgroundColor: 'none',
                shadow: false,
                style: {
                    fontSize: '12px'
                },
                //pointFormat: '<span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}%</span>',
                formatter: function() {
                    return '<span style="font-size: 1.5em; color: '+this.color+'; font-weight: bold">'+this.y+'%</span><label style="font-size: 1.5em"> ['+this.point.count+']</label>';
                },
                positioner: function (labelWidth) {
                    return {
                        x: (this.chart.chartWidth - labelWidth) / 2,
                        y: (this.chart.plotHeight / 2) + 35
                    };
                }
            },

            pane: {
                startAngle: 0,
                endAngle: 360,
                background: panes
            },

            yAxis: {
                min: 0,
                max: 100,
                lineWidth: 0,
                tickPositions: []
            },

            plotOptions: {
                solidgauge: {
                    dataLabels: {
                        enabled: false
                    },
                    linecap: 'round',
                    stickyTracking: false,
                    rounded: true
                }
            },

            series: chartData,
            legend: {
              labelFormatter: function() {
                return '<span style="text-weight:bold;color:' + this.userOptions.color + '">' + this.name + '</span> '
                  +'(Target: '+(this.userOptions.target/($('#country').val() ? 5 : 1))+')';
              },
              symbolWidth: 0
            }
        });
        break;
      default:
        chartData = [];
        for (obj in data[chartObj]) {
          chartData.push({name: obj, y: data[chartObj][obj], color: "#"+((obj in charts[chartObj]['style']) ? charts[chartObj]['style'][obj] : ((1<<24)*Math.random()|0).toString(16))});
        }

        //console.log(data[chartObj]);
        $('#chart-'+chartObj).highcharts({
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            width: 425
          },
          title: {
            text: charts[chartObj]['title']
          },
          tooltip: {
            //pointFormat: '<b>{point.y:.0f}</b>'
            pointFormat: '<b>{point.percentage:.1f} % [{point.y:.0f}]</b>'
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                formatter: function() {
                  return Math.round(this.percentage*100)/100 + ' %';
                },
                distance: -30
              },
              showInLegend: true
            }
          },
          series: [{
            type: 'pie',
            name: charts[chartObj],
            data: chartData
          }]
        });
    }
	}
}
</script>
