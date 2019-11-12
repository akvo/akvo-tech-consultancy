<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Iucn_controller extends CI_Controller {
    public function __construct(){
        parent::__construct();
        $this->load->helper('url');
        $this->load->helper('functions');
    }

    public function index($page = "activities"){
      $pages = array('activities', 'results');
        $data = array();
        if (!in_array($page, $pages)) {
          echo $page;
          show_404();
        }

        $data['visualisation_details'] = array(
          'activities' => array(
            'table' => 'tof_28030003',
            'columns' => array(
                'q20080001' => array(
                    'title' => "Type of activity",
                    'type' => "pie",
                    'style' => array()
                ),
                'q2790002' => array(
                    'title' => "Subject",
                    'type' => "pie",
                    'style' => array()
                ),
                'sex' => array(
                    'title' => "Gender",
                    'type' => "pie",
                    'style' => array(
                      "Female" => "ef6bed",
                      "Male" => "42a4b7"
                    )
                ),
                'q670001' => array(
                    'title' => "Participants",
                    'type' => "pie",
                    'style' => array()
                ),
                'q22140004' => array(
                    'title' => "Scale",
                    'type' => "pie",
                    'style' => array()
                )
            ),
            'forms' => array("New form"),
            'survey_group_id' => "550001",
            'event_type' => "Activity",
            'map_column' => "", //column to use to style the map. Can be set to blank if map is not to be styled
            'map_interactivity' => array(
                "identifier",
                "submitter",
                "q4800002"), //if multiple, separate with commas
            'popup_title' => "q4800002",
            'boundaries_layer' => "",
            'link_title' => 'activities'
          ),
          'results' => array(
            'table' => 'tof_28030003',
            'columns' => array(
                /*'q670002' => array(
                  'title' => "Link to result framework",
                  'type' => "vbar",
                  'style' => array()
                ),*/
                'res_val_0' => array(
                  'title' => "Result value for outcome 0",
                  'type' => "gauge",
                  'style' => array(),
                  'cols' => array(
                    'q22140006' => array(
                      'target' => 20,
                      'title' => "0.1: # of orgs that include TonF targets"
                    ), //Result value for 0.1: # of orgs that include TonF targets
                    'q26370001' => array(
                      'target' => 10,
                      'title' => "0.2: # of orgs that have financing system for TonF targets"
                    ), //Result value for 0.2: # of orgs that have financing system for TonF targets
                    'q12270002' => array(
                      'target' => 10,
                      'title' => "0.3: # of MoUs signed"
                    ) //Result value for 0.3: # of MoUs signed
                  )
                ),
                'res_val_1' => array(
                  'title' => "Result value for output 1",
                  'type' => "gauge",
                  'style' => array(),
                  'cols' => array(
                    'q3900002' => array(
                      'target' => 500,
                      'title' => "1.1: # of manuals disseminated"
                    ), // Result value for 1.1: # of manuals disseminated
                    'q26360002' => array(
                      'target' => 500,
                      'title' => "1.2: # of people trained on TonF options"
                    ) //Result value for 1.2: # of people trained on TonF options
                  )
                ),
                'res_val_2' => array(
                  'title' => "Result value for output 2",
                  'type' => "gauge",
                  'style' => array(),
                  'cols' => array(
                    'q10320002' => array(
                      'target' => 10,
                      'title' => "2.1: # of databases available and disseminated"
                    ), //Result value for 2.1: # of databases available and disseminated
                    'q5920002' => array(
                      'target' => 250,
                      'title' => "2.2: # of people trained on biodiversity tool"
                    ) //Result value for 2.2: # of people trained on biodiversity tool
                  )
                ),
                'res_val_3' => array(
                  'title' => "Result value for output 3",
                  'type' => "gauge",
                  'style' => array(),
                  'cols' => array(
                    'q9900004' => array(
                      'target' => 5,
                      'title' => "3.1: # of MoUs signed"
                    ), //Result value for 3.1: # of MoUs signed
                    'q5930002' => array(
                      'target' => 5,
                      'title' => "3.2: # of UNCBD reports including TonF costs"
                    ) //Result value for 3.2: # of UNCBD reports including TonF costs
                  )
                ),
                'res_val_4' => array(
                  'title' => "Result value for output 4",
                  'type' => "gauge",
                  'style' => array(),
                  'cols' => array(
                    'q14290003' => array(
                      'target' => 5,
                      'title' => "4.1: # of signed agreements"
                    ), //Result value for 4.1: # of signed agreements
                    'q22270002' => array(
                      'target' => 5,
                      'title' => "4.2: # of IP operation manuals or TOR"
                    ), //Result value for 4.2: # of IP operation manuals or TOR
                    'q18380002' => array(
                      'target' => 40,
                      'title' => "4.3: # of orgs participating in IPs"
                    ), //Result value for 4.3: # of orgs participating in IPs
                    'q30000004' => array(
                      'target' => 15,
                      'title' => "4.4: # of TonF targets agreed"
                    ) //Result value for 4.4: # of TonF targets agreed
                  )
                ),
                'res_val_5' => array(
                  'title' => "Result value for output 5",
                  'type' => "gauge",
                  'style' => array(),
                  'cols' => array(
                    'q9910003' => array(
                      'target' => 5,
                      'title' => "5.1: # of knowledge management systems"
                    ), //Result value for 5.1: # of knowledge management systems
                    'q5930003' => array(
                      'target' => 5,
                      'title' => "5.2: # of communication packages"
                    ), //Result value for 5.2: # of communication packages
                    'q22250002' => array(
                      'target' => 40,
                      'title' => "5.3: # of people trained"
                    ) //Result value for 5.3: # of people trained
                  )
                )
            ),
            'forms' => array("New form"),
            'survey_group_id' => "550001",
            'event_type' => "Result",
            'map_column' => "", //column to use to style the map. Can be set to blank if map is not to be styled
            'map_interactivity' => array(
                "identifier",
                "submitter",
                "q4800002"), //if multiple, separate with commas
            'popup_title' => "q4800002",
            'boundaries_layer' => "",
            'link_title' => 'results'
          )
        );

        $data['title'] = "Trees on Farms";
        $data['page'] = $page;
        $data['source'] = "Akvo Flow";
        $data['source_link'] = "https://iucn.akvoflow.org";
        $data['levels'] = array(
            "Local",
            "Subnational/district",
            "Regional",
            "National",
            "International"
        );

        if(file_exists("resources/data/admin_organs.csv" )){
            $csv = array_map("str_getcsv", file("resources/data/admin_organs.csv", FILE_SKIP_EMPTY_LINES));
            $keys = array_shift($csv);
            foreach ($csv as $i=>$row){
                $csv[$i] = array_combine($keys, $row);
            }
            $data['admin_organs'] = $csv;
        }

        $this->load->view('templates/header', $data);
        $this->load->view('graph', $data);
        $this->load->view('templates/footer');
    }

    public function get_graph_data(){
        $output = array();
        $cartodb_api_key = "0344aaf6dba34f9786bbbc90805b8bc5143043eb";
        $filters = array(
            'country' => 'q10170002'
        );
        $levels = array(
            "Local" => 0,
            "Subnational/district" => 1,
            "National" => 2,
            "Regional" => 3,
            "International" => 4
        );

        if (!empty($this->input->post())){
            $filter = ($this->input->post('filter') != "") ? $filters[$this->input->post('filter')] : "";
            $filter_value = $this->input->post('filter_value');
            $event_type = $this->input->post('report_on');

            $query = "SELECT identifier, submitter, collection_date, q4800002, q20080001, q22140004 FROM tof_28030003";
            $query .= " WHERE q4800002 = '$event_type'";
            $query .= ($filter != '') ? " AND $filter = '$filter_value'" : "";

            $url = "https://akvo.cartodb.com/api/v2/sql?q=".urlencode($query)."&api_key=$cartodb_api_key";
            $response = curl_get_data($url);

            //convert response to array
            $response_array = json_decode($response, true);

            if (!empty($response_array['rows'])){
                $types = array();
                foreach ($response_array['rows'] as $row){
                    if (!in_array($row['q4800002'], $types) && !empty($row['q4800002'])){
                        array_push($types, $row['q4800002']);
                    }
                }
                foreach ($types as $type){
                    $type_output = array();
                    $type_output['name'] = $type;
                    //$type_output['color'] = "";
                    $type_output['data'] = array();
                    foreach ($response_array['rows'] as $row){
                        if ($row['q4800002'] == $type && in_array($row['q22140004'], array_keys($levels))){
                            array_push($type_output['data'], array(
                                'identifier' => $row['identifier'],
                                'q4800002' => $row['q4800002'],
                                'name' => $row['submitter'],
                                'x' => intval($row['collection_date']),
                                'y' => $levels[$row['q22140004']],
                                'color' => ($row['q4800002'] == "Activity") ? "#ea2aca" : "#012700")
                            );
                        }
                    }
                    if (!empty($type_output['data'])) {
                        array_push($output, $type_output);
                    }
                }
            }
        }

        $this->output
        ->set_header('Access-Control-Allow-Origin: *')
        ->set_header('Access-Control-Allow-Methods: GET')
        ->set_header('Pragma: no-cache')
        ->set_header('Access-Control-Allow-Credentials: true')
        ->set_header('Access-Control-Allow-Headers:X-Requested-With, authorization')
        ->set_content_type('text/json')
        ->set_content_type('application/json')
        ->set_output(json_encode($output));
    }

    public function get_table_data(){
        $output = array();
        $cartodb_api_key = "0344aaf6dba34f9786bbbc90805b8bc5143043eb";
        $filters = array(
            'country' => 'q10170002'
        );

        if (!empty($this->input->post())) {
            $filter = ($this->input->post('filter') != "") ? $filters[$this->input->post('filter')] : "";
            $filter_value = $this->input->post('filter_value');
            $event_type = $this->input->post('report_on');

            $query = "SELECT submitter, q10170002, collection_date, ".($event_type == 'Activity' ? "q20080001" : "q670002")." FROM tof_28030003";
            $query .= " WHERE q4800002 = '$event_type'";
            $query .= ($filter != '') ? " AND $filter = '$filter_value'" : "";
            $query .= "ORDER BY collection_date DESC";

            $url = "https://akvo.cartodb.com/api/v2/sql?q=".urlencode($query)."&api_key=$cartodb_api_key";
            $response = curl_get_data($url);

            //convert response to array
            $response_array = json_decode($response, true);

            if (!empty($response_array['rows'])){
                $output = $response_array['rows'];
            }
        }

        $this->output
        ->set_header('Access-Control-Allow-Origin: *')
        ->set_header('Access-Control-Allow-Methods: GET')
        ->set_header('Pragma: no-cache')
        ->set_header('Access-Control-Allow-Credentials: true')
        ->set_header('Access-Control-Allow-Headers:X-Requested-With, authorization')
        ->set_content_type('text/json')
        ->set_content_type('application/json')
        ->set_output(json_encode($output));
    }

    public function get_data(){
        $output = array();
        $cartodb_api_key = "0344aaf6dba34f9786bbbc90805b8bc5143043eb";
        $filters = array(
            'country' => 'q10170002'
        );
        $others = array("q20080001","q2790002","q670001");
        $q20080001_options = array("Field action","Training","Meeting","Data collection");
        $q2790002_options = array("Options Manual development","Biodiversity monitoring tool development","Political and financial framework assessment","Network mapping and growth","Knowledge management and capacity strengthening");
        $q670001_options = array("Local government","National government","CSO","Private sector","NGO","Academia","Media","Traditional authority","Farmer/Community");


        if (!empty($this->input->post())) {
            $filter = ($this->input->post('filter') != "") ? $filters[$this->input->post('filter')] : "";
            $filter_value = $this->input->post('filter_value');
            $event_type = $this->input->post('report_on');

            $fields_array = ($this->input->post('fields') ? $this->input->post('fields') : array());
            $gauges_array = $this->input->post('gauges');
            $fields = array();
            $gauges = array();

            foreach ($fields_array as $field) {
              if ($field == "sex") {
                array_push($fields, "q9760001", "q18170004");
              } else {
                array_push($fields, $field);
              }
            }

            if ($gauges_array) {
              foreach ($gauges_array as $res_val => $cols) array_push($gauges, ...$cols);
              array_push($fields, ...$gauges);
            }

            /*//uncomment when you want to load some dummy data for results
            $gaug_vals = array();
            foreach ($gauges as $gauge) {
              array_push($gaug_vals, rand(1,20));
            }

            $output['qu'] = "UPDATE ".$this->input->post('survey')." SET (".implode(", ", $fields).") = (".implode(", ", $gaug_vals).") WHERE q4800002 = 'Result'";*/

            $query = "SELECT identifier, ".implode(", ", $fields)." FROM ".$this->input->post('survey');
            $query .= " WHERE q4800002 = '$event_type'";
            $query .= ($filter != '') ? " AND $filter = '$filter_value'" : "";

            $url = "https://akvo.cartodb.com/api/v2/sql?q=".urlencode($query)."&api_key=$cartodb_api_key";
            $response = curl_get_data($url);

            //convert response to array
            $response_array = json_decode($response, true);

            if (!empty($response_array['rows'])) {
                foreach ($fields as $field) {
                  if ($field == "q9760001" || $field == "q18170004") {
                    if (!in_array("sex", array_keys($output))) {
                      $output["sex"] = array();
                      $output["sex"]["Female"] = 0;
                      $output["sex"]["Male"] = 0;
                    }
                    foreach ($response_array['rows'] as $row) {
                      $output["sex"]["Female"] += $field == "q9760001" ? $row["q9760001"] : 0;
                      $output["sex"]["Male"] += $field == "q18170004" ? $row["q18170004"] : 0;
                    }
                  } else {
                    if (in_array($field, $gauges)) {
                      foreach ($gauges_array as $res_val => $cols) {
                        if (!in_array($res_val, array_keys($output))) {
                          $output[$res_val] = array();
                          foreach ($cols as $column) {
                            $output[$res_val][$column] = 0;
                          }
                        }
                      }
                      foreach ($response_array['rows'] as $row) {
                        foreach ($gauges_array as $res_val => $cols) {
                          if (in_array($field, $cols)) {
                            $output[$res_val][$field] += $row[$field];
                          }
                        }
                      }
                    } else {
                      ${$field."_output"} = array();
                      ${$field."_options_array"} = array();

                      foreach ($response_array['rows'] as $row){
                          if (array_key_exists($field, $row)) {
                              if (strpos($row[$field], '|') !== false) {
                                  $field_array = explode('|', $row[$field]);
                                  foreach ($field_array as $field_array_value) {
                                      //Check for other because Flow
                                      if (startsWith(trim($field_array_value), "OTHER:")) {
                                          if (!in_array("Other", ${$field."_options_array"})) {
                                              array_push(${$field."_options_array"}, "Other");
                                          }
                                      } else {
                                          if (!in_array($field, $others)) {
                                              if (!in_array(trim($field_array_value), ${$field."_options_array"})) {
                                                  array_push(${$field."_options_array"}, trim($field_array_value));
                                              }
                                          } else {
                                              if (!in_array(trim($field_array_value), ${$field."_options"})) {
                                                  if (!in_array("Other", ${$field."_options_array"})) {
                                                      array_push(${$field."_options_array"}, "Other");
                                                  }
                                              } else {
                                                if (!in_array(trim($field_array_value), ${$field."_options_array"})) {
                                                  array_push(${$field."_options_array"}, trim($field_array_value));
                                                }
                                              }
                                          }
                                      }
                                  }
                              } else {
                                  if (startsWith($row[$field], "OTHER:")) {
                                      if (!in_array("Other", ${$field."_options_array"})) {
                                          array_push(${$field."_options_array"}, "Other");
                                      }
                                  } else {
                                      if (!in_array($field, $others)) {
                                          if(!in_array($row[$field], ${$field."_options_array"})){
                                              array_push(${$field."_options_array"}, $row[$field]);
                                          }
                                      } else {
                                          if (!in_array($row[$field], ${$field."_options"})) {
                                              array_push(${$field."_options_array"}, "Other");
                                          } else {
                                              array_push(${$field."_options_array"}, $row[$field]);
                                          }
                                      }
                                  }
                              }
                          }
                      }

                      foreach (${$field."_options_array"} as $key => $field_option) {
                          ${"field_option_$key"} = 0;
                          if ($field_option != "" && $field_option != null && $field_option != "null") {
                              ${$field."_output"}[$field_option] = 0;
                          }
                      }

                      //initialise array of identifiers
                      ${$field."_identifiers"} = array();
                      foreach ($response_array['rows'] as $row) {
                          if (!in_array($row['identifier'], ${$field."_identifiers"})) {
                              if (array_key_exists($field, $row)) {
                                  if (strpos($row[$field], '|') !== false) {
                                      foreach (${$field."_options_array"} as $key => $field_option) {
                                          $field_array = explode('|', $row[$field]);
                                          foreach ($field_array as $field_array_value) {
                                              if (startsWith(trim($field_array_value), "OTHER:") && "Other" == $field_option) {
                                                  ${"field_option_$key"}++;
                                                  ${$field."_output"}["Other"] = ${"field_option_$key"};
                                              } else {
                                                  if (!in_array($field, $others)) {
                                                      if(trim($field_array_value) == $field_option) {
                                                          ${"field_option_$key"}++;
                                                          ${$field."_output"}[trim($field_array_value)] = ${"field_option_$key"};
                                                      }
                                                  } else {
                                                      if (!in_array(trim($field_array_value), ${$field."_options"})) {
                                                          if ("Other" == $field_option) {
                                                              ${"field_option_$key"}++;
                                                              ${$field."_output"}["Other"] = ${"field_option_$key"};
                                                          }
                                                      } else {
                                                          if(trim($field_array_value) == $field_option){
                                                              ${"field_option_$key"}++;
                                                              ${$field."_output"}[trim($field_array_value)] = ${"field_option_$key"};
                                                          }
                                                      }
                                                  }

                                              }
                                          }
                                      }
                                  } else {
                                      foreach (${$field."_options_array"} as $key => $field_option){
                                          if (startsWith($row[$field], "OTHER:") && "Other" == $field_option) {
                                              ${"field_option_$key"}++;
                                              ${$field."_output"}["Other"] = ${"field_option_$key"};
                                          } else {
                                              if (!in_array($field, $others)) {
                                                  if ($row[$field] == $field_option) {
                                                      if ($row[$field] != "" && $row[$field] != null && $row[$field] != "null") {
                                                          ${"field_option_$key"}++;
                                                          ${$field."_output"}[$row[$field]] = ${"field_option_$key"};
                                                      }
                                                  }
                                              } else {
                                                  if (!in_array($row[$field], ${$field."_options"})) {
                                                      if ("Other" == $field_option) {
                                                          ${"field_option_$key"}++;
                                                          ${$field."_output"}["Other"] = ${"field_option_$key"};
                                                      }
                                                  } else {
                                                      if ($row[$field] == $field_option) {
                                                          ${"field_option_$key"}++;
                                                          ${$field."_output"}[$row[$field]] = ${"field_option_$key"};
                                                      }
                                                  }
                                              }
                                          }
                                      }
                                  }
                              }
                              array_push(${$field."_identifiers"}, $row['identifier']);
                          }
                      }
                      $output[$field] = ${$field."_output"};
                    }
                  }
                }
            }
        }

        $this->output
        ->set_header('Access-Control-Allow-Origin: *')
        ->set_header('Access-Control-Allow-Methods: GET')
        ->set_header('Pragma: no-cache')
        ->set_header('Access-Control-Allow-Credentials: true')
        ->set_header('Access-Control-Allow-Headers:X-Requested-With, authorization')
        ->set_content_type('text/json')
        ->set_content_type('application/json')
        ->set_output(json_encode($output));
    }
}
