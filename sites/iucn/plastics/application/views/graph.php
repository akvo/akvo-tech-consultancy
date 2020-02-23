<?php
$admin_organ_types = array();
foreach ($admin_organs as $admin_organ){
  if(!in_array($admin_organ['type'], $admin_organ_types)){
    array_push($admin_organ_types, $admin_organ['type']);
  }
}
$col_size = round((12/count($admin_organ_types)), 0, PHP_ROUND_HALF_DOWN);
?>
<div class="row">
  <?php foreach ($admin_organ_types as $admin_organ_type):?>
  <div class="col-md-<?=$col_size;?>">
    <div class="form-group">
      <label for="<?=$admin_organ_type?>"><?=ucname(str_replace("_", " ", $admin_organ_type))?></label>
      <select class="form-control input-md selectpicker" name="<?=$admin_organ_type?>" id="<?=$admin_organ_type?>">
        <option value="">--All--</option>
      </select>
    </div>
  </div>
  <?php endforeach;?>
</div>

<div class="row">
  <div class="col-md-12" id="loading_animation" style="text-align: center; display: block"><img alt="Loading" src="<?=base_url()?>resources/images/ajax-loader.gif"></div>
</div>
<div class="row">
  <div class="col-md-7">
    <div id="map" class="col-md-12"></div>
    <p><label>Data source: <a href="https://iucn.akvoflow.org" target="_blank">Akvo Flow</a></label></p>
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
<div class="row">
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
<?php case 'outcome': ?>
<th>Type of actor</th>
<th>Description of outcome</th>
<th>Contribution of the programme</th>
<th>Type of evidence</th>
<?php break; ?>
<?php endswitch ?>
          </tr>
        </thead>
        <tbody id="table-data"></tbody>
      </table>
  </div>
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
            <h4>{{content.data.q223910002}}</h4>
            <label>Submitted by {{content.data.submitter}}</label>
        </div>
    </div>
    <div class="cartodb-popup-tip-container"></div>
</div>
</script>
<!-- End Carto info window -->

<script type="text/javascript">
var map, selectedFilter="", selectedFilterText="", filterLevel=0;
var adminOrgans = <?=(isset($admin_organs) ? json_encode($admin_organs) : '[]')?>;
var projects = <?=(isset($projects) ? json_encode($projects) : '[]')?>;
const projectQuestionId = '<?=$project_question_id?>';
const defaultQuery = "SELECT * FROM iucn_plastics_249830001 WHERE LOWER(q223910002) LIKE '%"
    +('<?=$visualisation_details[$page]['event_type']?>').toLowerCase()+"%'";
var eventType = '<?=$visualisation_details[$page]['event_type']?>';
var visualisationDetails = <?=json_encode($visualisation_details[$page])?>;
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
  adminOrgans.sort(function(el1, el2){
    return compare(el1, el2, "name")
  });

  <?php if (!empty($admin_organ_types)):?>
  for (var i=0; i<adminOrgans.length; i++){
    if (adminOrgans[i].type == '<?=$admin_organ_types[0]?>'){
      $("#<?=$admin_organ_types[0]?>").append('<option value="'+convertToSlug(adminOrgans[i].name)+'">'+adminOrgans[i].name+'</option>');
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
        sql: defaultQuery,
        cartocss: '#iucn_plastics_249830001 {'
          +'marker-fill: #012700;'
          +'marker-fill-opacity: 0.9;'
          +'marker-line-color: #FFF;'
          +'marker-line-width: 1;'
          +'marker-line-opacity: 1;'
          +'marker-placement: point;'
          +'marker-type: ellipse;'
          +'marker-width: 10;'
          +'marker-allow-overlap: true;'
          +'}'/**/,
      interactivity: '<?=implode(", ", $visualisation_details[$page]['map_interactivity'])?>'
    }]
  }, {tooltip: false, https: true})
  .addTo(map, 1)
  .done( function(layer) {
    //do stuff
    layer.setZIndex(1000); //required to ensure that the cartodb layer is not obscured by the here maps base layers

    fitMapToLayer(defaultQuery);

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
    for (var i=0; i<adminOrgans.length; i++){
      if (adminOrgans[i].type == '<?=$admin_organ_types[$key+1]?>' && adminOrgans[i].parent == $( "#<?=$admin_organ_types[$key]?> option:selected" ).text()){
        $("#<?=$admin_organ_types[$key+1]?>").append('<option value="'+convertToSlug(adminOrgans[i].name)+'">'+adminOrgans[i].name+'</option>');
      }
    }
    <?php endif;?>
    selectedFilter = "<?=$admin_organ_types[$key]?>";
    selectedFilterText = $("#<?=$admin_organ_types[$key]?> option:selected").text();
    filterLevel = <?=$key+1?>;

    LayerActions['<?=$admin_organ_types[$key]?>']();
  } else {
    //call function to filter map layer and draw chart
    <?php if ($key == 0):?>
    selectedFilter = "";
    selectedFilterText = "";
    filterLevel = 0;

    LayerActions['all']();
    <?php else:?>
    selectedFilter = "<?=$admin_organ_types[$key-1]?>";
    selectedFilterText = $("#<?=$admin_organ_types[$key-1]?> option:selected").text();
    filterLevel = <?=$key?>;

    LayerActions['<?=$admin_organ_types[$key-1]?>']();
    <?php endif;?>
  }
  $('.selectpicker').selectpicker('refresh');

  getData();
});
<?php endforeach;?>

// $("#event-type").change(function(){
// 	getData();
// 	if ($("#country").val() != "") {
// 		LayerActions['country']();
// 	} else {
// 		LayerActions['all']();
// 	}
// });

var LayerActions = {
  all: function(){
    var query = defaultQuery;
    dataLayer.setSQL(query);

    fitMapToLayer(query);
    return true;
  }<?php foreach ($admin_organ_types as $admin_organ_type):?>,
  <?=$admin_organ_type?>: function(){
    <?php
    switch ($admin_organ_type) {
      case 'project':?>
        let questionId = '<?='q'.$project_question_id;?>';
        <?php break;
      case 'country':?>
        const project = projects.find(proj => proj.countries.indexOf($( "#<?=$admin_organ_type?> option:selected" ).text()) > -1);
        let questionId = 'q'+project.question_id;
        <?php break;
    }?>
    const filterVal = $( "#<?=$admin_organ_type?> option:selected" ).text().split(" ");
    var query = "SELECT * FROM <?=$visualisation_details[$page]['table']?> WHERE "
      +"LOWER(q223910002) LIKE '%"+('<?=$visualisation_details[$page]['event_type']?> '+filterVal[0]).toLowerCase()+"%'"
      +" AND LOWER("+questionId+") LIKE '%"+$( "#<?=$admin_organ_type?> option:selected" ).text().toLowerCase()+"%'";
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
          
        //for every instance in the form, add
        /*
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
}

function getData () {
  let queryData = {};
  let questionId = "";
  let catQid = "";
  if (selectedFilter) {
    const project = projects.find(proj => proj.project_name == $( "#project option:selected" ).text());
    if (selectedFilter == "project") {
      questionId = 'q'+projectQuestionId;
      catQid = 'q'+project.question_id;
    } else if (selectedFilter == "country") {
      questionId = 'q'+project.question_id;
      catQid = '<?=($visualisation_details[$page]['event_type'] == 'Activity' ? "q233810002" : "q255740002")?>'; //categorize either by activity type or result actor
    }
  } else {
    catQid = 'q'+projectQuestionId;
  }

  queryData['filter'] = questionId;
  queryData['filter_value'] = selectedFilterText.toLowerCase();
  queryData['report_on'] = ('<?=$visualisation_details[$page]['event_type']?>'
    + (selectedFilter ? " "+$( "#project option:selected" ).text().split(" ")[0] : "")).toLowerCase();
  queryData['level'] = filterLevel;
  queryData['tl_categorization'] = catQid;

  var the_path = window.location.pathname.split('/');
  if (the_path[2] === 'activities') {
    if ($('#project').val() ==='sida-marplasticcs') {
      $($('#accordion .panel')[3]).hide();
      $($('#accordion .panel')[2]).show();
    } else if ($('#project').val() ==='norad-plastic-wastefree-islands' || $('#project').val() ==='primat-plastic-wastefree-islands') {
      $($('#accordion .panel')[2]).hide();
      $($('#accordion .panel')[3]).show();
    } else {
      $($('#accordion .panel')[2]).show();
      $($('#accordion .panel')[3]).show();
    }
  } else {
    if ($('#project').val() ==='sida-marplasticcs') {
      $($('#accordion .panel')[4]).hide();
      $($('#accordion .panel')[3]).show();
    } else if ($('#project').val() ==='norad-plastic-wastefree-islands' || $('#project').val() ==='primat-plastic-wastefree-islands') {
      $($('#accordion .panel')[3]).hide();
      $($('#accordion .panel')[4]).show();
    } else {
      $($('#accordion .panel')[3]).show();
      $($('#accordion .panel')[4]).show();
    }
  }

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
  foreach ($visualisation_details[$page]['columns'] as $key => $cat) {
    if ($key != 'subject') {
      array_push($fields, $key);
    }
  }?>
  let fields = <?=json_encode($fields)?>;
  if (selectedFilter && eventType == "Activity") {
    // fields.push('q'+visualisationDetails['columns']['subject']['project'][$( "#project option:selected" ).text().toLowerCase().split(" ")[0]]);
  }
  queryData['fields'] = fields;
  queryData['survey'] = '<?=$visualisation_details[$page]['table']?>';
  $.post(
    "<?=base_url()?>index.php/charts-data",
    queryData,
    function(data, status){
      drawCharts(data);
    });
}

function populateTable(data) {
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
                    q223910002: e.point.q223910002
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
    var chartData = [];
    let colTitle;
    /*
    if (chartObj == "q241810001" || chartObj == "q235950001") { //handle dependency in activities
      colTitle = 'subject';
    } else {
      colTitle = chartObj;
    }
    */
    colTitle = chartObj;
    switch (charts[colTitle]['type']) {
      case "vbar":
        for (obj in data[chartObj]) {
          chartData.push({
            name: obj,
            data: [data[chartObj][obj]]
          });
        }

        $('#chart-'+colTitle).highcharts({
          chart: {
            type: 'column'
          },
          title: {
            text: charts[colTitle]['title']
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
              categories: ['results'],
              labels: {
                  step: 1,
                  style:{
                    textOverflow: 'ellipsis'
                  }
              }
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
          series: chartData
        });
        break;
      case "vbar-custom":
        for (obj in data[chartObj]) {
          chartData.push({
            name: obj,
            data: [data[chartObj][obj]]
          });
        }

        $('#chart-'+colTitle).highcharts({
          chart: {
            type: 'column'
          },
          title: {
            text: charts[colTitle]['title']
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
              categories: ['results'],
              labels: {
                  step: 1,
                  style:{
                    textOverflow: 'ellipsis'
                  }
              }
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
          series: chartData
        });
        break;
      default:
        for (obj in data[chartObj]) {
          chartData.push({name: obj, y: data[chartObj][obj], color: "#"+((obj in charts[colTitle]['style']) ? charts[colTitle]['style'][obj] : ((1<<24)*Math.random()|0).toString(16))});
        }

        //console.log(data[chartObj]);
        $('#chart-'+colTitle).highcharts({
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            width: 425
          },
          title: {
            text: charts[colTitle]['title']
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
            name: charts[colTitle],
            data: chartData
          }]
        });
    }
  }
}
</script>
