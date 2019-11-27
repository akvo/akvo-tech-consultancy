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
	<div class="col-md-3">
		<div class="form-group">
			<select class="form-control input-md selectpicker" name="event-type" id="event-type">
				<option value="">--Event type--</option>
				<option value="Activity">Activity</option>
				<option value="Intended or unexpected Result">Intended or unexpected Result</option>
			</select>
		</div>
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
        				<th>Date</th>
        				<th>Report On</th>
        				<th>Link to project result framework</th>
        				<th>Activity type</th>
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
		                <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#timeline">Activity timeline</a>
					</h4>
				</div>
				<div id="timeline" class="panel-collapse collapse in">
					<div class="panel-body">
						<div class="chart" id="timeline-graph"></div>
					</div>
				</div>
		    </div>
		<?php
		$charts = $visualisation_details['columns'];
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
            <h4>{{content.data.q6140001}}</h4>
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

	map = L.map('map', { maxZoom: 10 }).setView([0, 0], 0);
 
	var tileServer = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    tileAttribution = 'Tiles © Wikimedia — Source: OpenStreetMap, Data: Unicef Pacific WASH, <a href="https://akvo.org">Akvo SEAP</a>';

  L.tileLayer(tileServer, {
      attribution: tileAttribution,
      maxZoom: 18
  }).addTo(map);

	cartodb.createLayer(map, {
	    user_name: 'akvo',
	    type: 'cartodb',
	    sublayers: [{
		    sql: "SELECT * FROM iucn_7160001",
		    cartocss: '#iucn_7160001 {'
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
			    +'#iucn_7160001[q6140001=\'Activity\'] {'
			    +'marker-fill: #ea2aca;'
			    +'}'
			    +'#iucn_7160001[q6140001=\'Intended or unexpected Result\'] {'
			    +'marker-file: url(http://213.136.89.20/akvo/DNAAS/resources/images/black.svg);'
			    +'}'/**/,
			interactivity: '<?=implode(", ", $visualisation_details['map_interactivity'])?>'
		}]
	}, {tooltip: false, https: true})
	.addTo(map, 1)
	.done( function(layer) {
		//do stuff
		layer.setZIndex(1000); //required to ensure that the cartodb layer is not obscured by the here maps base layers

		fitMapToLayer("SELECT * FROM iucn_7160001");

		addCursorInteraction(layer);

		dataLayer = layer.getSubLayer(0);

		dataLayer.setInteraction(true);
		dataLayer.set({'interactivity': '<?=implode(", ", $visualisation_details['map_interactivity'])?>'});
		cdb.vis.Vis.addInfowindow(map, layer.getSubLayer(0), <?=json_encode($visualisation_details['map_interactivity'])?>, {
			infowindowTemplate: $('#iucn-infowindow').html()
		});

		dataLayer.on('featureClick', function(e, latlng, pos, data) {
			$.get(
					"<?=base_url()?>index.php/point-data/"+data.identifier+"/<?=$visualisation_details['survey_group_id']?>",
					function(dt, status){
						var formsOrder = <?=json_encode($visualisation_details['forms'])?>, orderedDt = {};
						for (var i=0; i<formsOrder.length; i++) {
							orderedDt[formsOrder[i]] = dt[formsOrder[i]];
						}

						var formCount = 0;
						moreInfoLink = $(".open-modal-infobox");
						moreInfoLink.click();
						$("#forms-nav").html("");
						$("#point-content").html("");
						$("#point-title").html(data.<?=$visualisation_details['popup_title']?>);
						for (form in orderedDt) {
							$("#forms-nav").append("<li class=\""+((formCount === 0) ? 'active' : '')
									+"\"><a href=\"#form-"+formCount+"\" data-toggle=\"tab\">"+form+"</a></li>");

							//create accordion to hold the instances
							$("#point-content").append("<div class=\"tab-pane "+((formCount === 0) ? 'active' : '')+"\" id=\"form-"+formCount+"\">&nbsp;</div>");
							$("#form-"+formCount).html("<div class=\"panel-group\" id=\"accordion-"+formCount+"\"></div>");
							
							var instanceCount = 0;
        var answers = '';
        for (instance in dt) {
          if (dt[instance]['question'] == undefined) continue;

          answers += "<tr><td><b>"+ dt[instance]['question'] +":</b> </td><td>";
          switch (dt[instance]['type']) {
            case "CASCADE":
              answers += dt[instance]['value'];
              break;
            case "IMAGE":
              answers += '<img style=\"width: 100%\" src="' + dt[instance]['value'] +'"/>';
              break;
            case "PHOTO":
              answers += '<img style=\"width: 100%\" src="' + dt[instance]['value'] +'"/>';
              break;
            case "SIGNATURE":
              answers += '<img style=\"width: 100%\" src="';
              answers += dt[instance]['value'] +'"/>';
              break;
            default:
              answers += dt[instance]['value'];
              break;
          }
          answers += "</td></tr>";
        }

        $("#accordion-"+formCount).append(
              "<div class=\"panel panel-default\">"
              +"<div class=\"panel-heading\">"
              +"<h4 class=\"panel-title\">"
              +"<a class=\"accordion-toggle\" data-toggle=\"collapse\" data-parent=\"#accordion-"+formCount+"\" >"+"</a>"
              +"</h4>"
              +"</div>"
            
              +"<div class=\"panel-body\">"
              //question-answer logic goes here
              +"<div class=\"table-responsive\"><table class=\"table table-condensed\">"+answers+"</table></div>"
              +"</div>"
              +"</div>"
              +"</div>"
              );
          instanceCount++;
							
							/*
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
							}*/
							formCount++;
						}
					});
		});
	})
	.error( function(err) {
	  console.log("some error occurred: " + err);
	});

	getData();
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

	getData();
});
<?php endforeach;?>

$("#event-type").change(function(){
	getData();
	if ($("#country").val() != "") {
		LayerActions['country']();
	} else {
		LayerActions['all']();
	}
});

var LayerActions = {
		all: function(){
			var query = "SELECT * FROM iucn_7160001"+($("#event-type").val() != "" ? " WHERE q6140001 = '"+$("#event-type").val()+"'" : "");
			dataLayer.setSQL(query);

			fitMapToLayer(query);
			return true;
		}<?php foreach ($admin_organ_types as $admin_organ_type):?>,
		<?=$admin_organ_type?>: function(){
			var query = "SELECT * FROM iucn_7160001 WHERE q2160001 LIKE '%"+$( "#<?=$admin_organ_type?> option:selected" ).text()+"%'"+($("#event-type").val() != "" ? " AND q6140001 = '"+$("#event-type").val()+"'" : "");
			dataLayer.setSQL(query);

			fitMapToLayer(query);
			return true;
		}
		<?php endforeach;?>
};

/*fit map to bounds*/
function fitMapToLayer(query) {
	var sql = new cartodb.SQL({ user: 'akvo' });
    sql.getBounds(query).done(function(bounds) {
      map.fitBounds(bounds)
    });
}
/*end fit map to bounds*/

function getData(){
	var queryData = {};
	queryData['filter'] = selectedFilter;
	queryData['filter_value'] = selectedFilterText;
	queryData['event_type'] = $("#event-type").val();

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

	queryData['fields'] = <?=json_encode(array_keys($visualisation_details['columns']))?>;
	queryData['survey'] = '<?=$visualisation_details['table']?>';
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
			"collection_date": "Date",
			"q6140001": "Report On",
			"q210007": "Link to project result framework",
			"q2150002": "Activity type"
	}
	$("#table-data").html("")
	for (var i=0; i<data.length; i++) {
		var row = "<tr>";
		for (obj in data[i]) {
			row += "<td>"+(obj == "collection_date" ? new Date(parseInt(data[i][obj])) : data[i][obj])+"</td>";
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
	        text: 'Activity levels by type'
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
	                }
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
	            }
	        }
	    },
	    series: data,
	    legend: {
            enabled: false
        }
    });
}

function drawCharts(data){
	var charts = <?=json_encode($charts)?>;

	for(chart_obj in charts){
		chart_data = [];
		for(obj in data[chart_obj]){
			chart_data.push({name: obj, y: data[chart_obj][obj]['count'], color: "#"+((obj in charts[chart_obj]['style']) ? charts[chart_obj]['style'][obj] : ((1<<24)*Math.random()|0).toString(16))});
	    }

		//console.log(data[chart_obj]);
		$('#chart-'+chart_obj).highcharts({
	        chart: {
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false,
	            width: 425
	        },
	        title: {
	            text: charts[chart_obj]['title']
	        },
	        tooltip: {
	            //pointFormat: '<b>{point.y:.0f}</b>'
		        pointFormat: '<b>{point.percentage:.1f} % ({point.y:.0f} points)</b>'
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
	            name: charts[chart_obj],
	            data: chart_data
	        }]
	    });
	    //console.log(JSON.stringify(current_chart_data));
	}
}
</script>
