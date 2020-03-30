<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Iucn_controller extends CI_Controller {
    public function __construct(){
        parent::__construct();
        $this->load->helper('url');
        $this->load->helper('functions');
    }

    public function index($page = "activities"){
      $pages = array('activities', 'results', 'outcome');
        $data = array();
        if (!in_array($page, $pages)) {
          show_404();
        }

        $data['project_question_id'] = '245700001';
        $data['projects'] = [
            array(
                'countries' => ['Mozambique', 'Kenya', 'South Africa', 'Thailand', 'Vietnam', 'Global'],
                'question_id' => '259640001',
                'project_name' => 'Sida MARPLASTICCs',
            ),
            array(
                'countries' => ['Antigua & Barbuda', 'St. Lucia', 'Grenada', 'Fiji', 'Vanuatu', 'Samoa', 'Global'],
                'question_id' => '245710001',
                'project_name' => 'Norad Plastic Waste-Free Islands',
            ),
            array(
                'countries' => ['Menorca', 'Cyprus', 'Global'],
                'question_id' => '225680001',
                'project_name' => 'Primat Plastic Waste-Free Islands',
            ),
        ];

        $data['cascade'] = array(['name', 'type', 'parent']);
        foreach ($data['projects'] as $project) {
            array_push($data['cascade'], [$project['project_name'], 'project', '']);
            foreach ($project['countries'] as $country) {
                array_push($data['cascade'], [$country, 'country', $project['project_name']]);
            }
        }

        $data['visualisation_details'] = array(
          'activities' => array(
            'table' => 'iucn_plastics_249830001',
            'columns' => array(
                'q233810002' => array(
                    'title' => "Type of activity",
                    'type' => "pie",
                    'style' => array()
                ),
                'q241810001' => array( //TODO: multiple activity questions (235950001)
                    'title' => "Link to MAREPLASTICCS result framework",
                    'type' => "pie",
                    'style' => array(),
                    'project' => array(
                        'sida' => '241810001',
                        'norad' => '235950001',
                        'primat' => '235950001'
                    )
                ),
                'q235950001' => array( //TODO: multiple activity questions (235950001)
                    'title' => "Link to PWFI result framework",
                    'type' => "pie",
                    'style' => array(),
                    'project' => array(
                        'sida' => '241810001',
                        'norad' => '235950001',
                        'primat' => '235950001'
                    )
                ),
                'sex' => array(
                    'title' => "Gender",
                    'type' => "pie",
                    'style' => array(
                      "Female" => "ef6bed",
                      "Male" => "42a4b7"
                    )
                ),
                'q239490004' => array(
                    'title' => "Participants",
                    'type' => "pie",
                    'style' => array()
                ),
                'q255750001' => array(
                    'title' => "Scale",
                    'type' => "pie",
                    'style' => array()
                )
            ),
            'forms' => array("Plastics Survey"),
            'survey_group_id' => "239480001",
            'event_type' => "Activity",
            'map_column' => "", //column to use to style the map. Can be set to blank if map is not to be styled
            'map_interactivity' => array(
                "identifier",
                "submitter",
                "q223910002"), //if multiple, separate with commas
            'popup_title' => "q223910002",
            'boundaries_layer' => "",
            'link_title' => 'activities'
          ),
          'outcome' => array(
            'table' => 'iucn_plastics_249830001',
            'columns' => array(
                'q233790004' => array(
                  'title' => "Significance of outcome",
                  'type' => "vbar",
                  'style' => array()
                ),
                'q255740002' => array(
                    'title' => "Type of actor",
                    'type' => "pie",
                    'style' => array()
                ),
                'q231790004' => array(
                    'title' => "Link to MAREPLASTICCS result framework",
                    'type' => "pie",
                    'style' => array()
                ),
                'q259650003' => array(
                    'title' => "Link to PWFI result framework",
                    'type' => "pie",
                    'style' => array()
                )
            ),
            'forms' => array("Plastics Survey"),
            'survey_group_id' => "239480001",
            'event_type' => "Result",
            'map_column' => "", //column to use to style the map. Can be set to blank if map is not to be styled
            'map_interactivity' => array(
                "identifier",
                "submitter",
                "q223910002"), //if multiple, separate with commas
            'popup_title' => "q223910002",
            'boundaries_layer' => "",
            'link_title' => 'outcome'
          )
        );

        $data['title'] = "IUCN Plastics";
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
            // $csv = array_map("str_getcsv", file("resources/data/admin_organs.csv", FILE_SKIP_EMPTY_LINES));
            $csv = $data['cascade'];
            $keys = array_shift($csv);
            foreach ($csv as $i=>$row){
                $csv[$i] = array_combine($keys, $row);
            }
            $data['admin_organs'] = $csv;
        }

        $cartodb_api_key = "0344aaf6dba34f9786bbbc90805b8bc5143043eb";
        $instance_ID_query = "SELECT * FROM iucn_plastics_249830001";
				$instance_ID_url = "https://akvo.cartodb.com/api/v2/sql?q=".urlencode($instance_ID_query)."&api_key=$cartodb_api_key";
        $instance_ID_response = curl_get_data($instance_ID_url);
        $instance_ID_response_array = json_decode($instance_ID_response, true);

        $this->load->driver('cache');

        foreach ($instance_ID_response_array['rows'] as $item) {
          $this->cache->file->save('identifier_' . $item['identifier'], $item, 86400);
        }

        $this->load->view('templates/header', $data);
        $this->load->view('graph', $data);
        $this->load->view('templates/footer');
    }

    public function get_timeline_data(){
        $output = array();
        $cartodb_api_key = "0344aaf6dba34f9786bbbc90805b8bc5143043eb";

        $levels = array(
            "Local" => 0,
            "Subnational/district" => 1,
            "National" => 2,
            "Regional" => 3,
            "International" => 4
        );

        if (!empty($this->input->post())) {
            $filter = $this->input->post('filter');
            $filter_value = $this->input->post('filter_value');
            $event_type = $this->input->post('report_on');
            $level = $this->input->post('level');
            $tl_categorization = $this->input->post('tl_categorization');

            $query = "SELECT identifier, submitter, collection_date, q223910002, q233810002, q255750001"
                .($tl_categorization != "q233810002" ? ", $tl_categorization" : "")." FROM iucn_plastics_249830001";
            $query .= " WHERE LOWER(q223910002) LIKE '%$event_type%'";
            $query .= ($filter_value != '') ? " AND LOWER($filter) LIKE '%$filter_value%'" : "";

            $url = "https://akvo.cartodb.com/api/v2/sql?q=".urlencode($query)."&api_key=$cartodb_api_key";
            $response = curl_get_data($url);

            //convert response to array
            $response_array = json_decode($response, true);

            if (!empty($response_array['rows'])){
                $countries = array();
                foreach ($response_array['rows'] as $row){
                    if (!in_array($row[$tl_categorization], $countries) && !empty($row[$tl_categorization])){
                        array_push($countries, $row[$tl_categorization]);
                    }
                }
                foreach ($countries as $country){
                    $country_output = array();
                    $country_output['name'] = $country;
                    $country_output['data'] = array();
                    foreach ($response_array['rows'] as $row){
                        if ($row[$tl_categorization] == $country && in_array($row['q255750001'], array_keys($levels))){
                            array_push($country_output['data'], array(
                                'identifier' => $row['identifier'],
                                'name' => $row['submitter'],
                                'x' => (int)$row['collection_date'],
                                'y' => $levels[$row['q255750001']])
                            );
                        }
                    }
                    if (!empty($country_output['data'])) {
                        array_push($output, $country_output);
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

        if (!empty($this->input->post())) {
            $filter = $this->input->post('filter');
            $filter_value = $this->input->post('filter_value');
            $event_type = $this->input->post('report_on');
            $level = $this->input->post('level');

            $query = "SELECT submitter, concat(q259640001, q245710001, q225680001) as country, collection_date, "
              .(strpos($event_type, 'activity') > -1 ? "q233810002"
                : "q255740002, q231800003, q229780004, q231790005")
                  ." FROM iucn_plastics_249830001";
            $query .= " WHERE LOWER(q223910002) LIKE '%$event_type%'";
            $query .= ($filter_value != '') ? " AND LOWER($filter) LIKE '%$filter_value%'" : "";
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
        $others = array("q233810002","q239490004");
        $q233810002_options = array("Field action","Training","Meeting","Data collection");
        $q239490004_options = array("Local government","National government","CSO","Private sector","NGO","Academia","Media","Traditional authority","Farmer/Community");
        $q241810001_options = array("Output 1: Understanding the state and impact of plastic pollution in the Indian Ocean and Asia Pacific regions","Output 2: Local and regional capacity building to facilitate national action to control plastic pollution","Output 3: Supporting national and regional policy frameworks and legislative reform processes to address plastics","Output 4: Engaging and mobilising business actors in support of effective management and reduction of plastic pollution","Output 5: Monitoring, evaluation, learning and reporting system operational");
        $q235950001_options = array("Outcome 1: Improve knowledge of waste generation","Outcome 2: Enhanced adoption of plastic leakage reduction measures","Outcome 3: Development of Plastic Waste Free Island blueprint and endorsement by regional SIDS bodies");
        $subject_options = array(
            "Improve knowledge of waste generation",
            "Enhanced adoption of plastic leakage reduction measures",
            "Development of Plastic Waste Free Island blueprint and endorsement by regional SIDS bodies",
            "National footprint",
            "Policy analysis",
            "Business engagement",
            "Circular economy initiative"
        );


        if (!empty($this->input->post())) {
            $filter = $this->input->post('filter');
            $filter_value = $this->input->post('filter_value');
            $event_type = $this->input->post('report_on');
            $level = $this->input->post('level');

            $fields_array = ($this->input->post('fields') ? $this->input->post('fields') : array());
            $fields = array();

            foreach ($fields_array as $field) {
              if ($field == "sex") {
                array_push($fields, "q229780002", "q231790003");
              } else {
                array_push($fields, $field);
              }
            }

            $query = "SELECT identifier, ".implode(", ", $fields).", q241810001, q235950001 FROM ".$this->input->post('survey');
            $query .= " WHERE LOWER(q223910002) LIKE '%$event_type%'";
            $query .= ($filter_value != '') ? " AND LOWER($filter) LIKE '%$filter_value%'" : "";

            $url = "https://akvo.cartodb.com/api/v2/sql?q=".urlencode($query)."&api_key=$cartodb_api_key";
            $response = curl_get_data($url);

            //convert response to array
            $response_array = json_decode($response, true);

            if (!empty($response_array['rows'])) {
                array_push($fields, "subject");
                foreach ($fields as $field) {
                  if ($field == "q229780002" || $field == "q231790003") {
                    if (!in_array("sex", array_keys($output))) {
                      $output["sex"] = array();
                      $output["sex"]["Female"] = 0;
                      $output["sex"]["Male"] = 0;
                    }
                    foreach ($response_array['rows'] as $row) {
                      $output["sex"]["Female"] += $field == "q229780002" ? $row["q229780002"] : 0;
                      $output["sex"]["Male"] += $field == "q231790003" ? $row["q231790003"] : 0;
                    }
                  } else {
                    ${$field."_output"} = array();
                    ${$field."_options_array"} = array();

                    $cols = array();
                    //$subject_cols = array("q241810001", "q235950001");
                    $subject_cols = [];
                    if ($field == "subject") {
                        //array_push($cols, "q241810001", "q235950001");
                        array_push($cols, $field);
                    } else {
                        array_push($cols, $field);
                    }

                    foreach ($response_array['rows'] as $row) {
                      foreach ($cols as $col) {
                          if (array_key_exists($col, $row)) {
                              if (strpos($row[$col], '|') !== false) {
                                  $field_array = explode('|', $row[$col]);
                                  foreach ($field_array as $field_array_value) {
                                      //Check for other because Flow
                                      if (startsWith(trim($field_array_value), "OTHER:")) {
                                          if (!in_array("Other", ${(in_array($col, $subject_cols) ? "subject" : $col)."_options_array"})) {
                                              array_push(${(in_array($col, $subject_cols) ? "subject" : $col)."_options_array"}, "Other");
                                          }
                                      } else {
                                          if (!in_array($field, $others)) {
                                              if (!in_array(trim($field_array_value), ${(in_array($col, $subject_cols) ? "subject" : $col)."_options_array"})) {
                                                  array_push(${(in_array($col, $subject_cols) ? "subject" : $col)."_options_array"}, trim($field_array_value));
                                              }
                                          } else {
                                              if (!in_array(trim($field_array_value), ${(in_array($col, $subject_cols) ? "subject" : $col)."_options"})) {
                                                  if (!in_array("Other", ${(in_array($col, $subject_cols) ? "subject" : $col)."_options_array"})) {
                                                      array_push(${(in_array($col, $subject_cols) ? "subject" : $col)."_options_array"}, "Other");
                                                  }
                                              } else {
                                                  if (!in_array(trim($field_array_value), ${(in_array($col, $subject_cols) ? "subject" : $col)."_options_array"})) {
                                                      array_push(${(in_array($col, $subject_cols) ? "subject" : $col)."_options_array"}, trim($field_array_value));
                                                  }
                                              }
                                          }
                                      }
                                  }
                              } else {
                                  if (startsWith($row[$col], "OTHER:")) {
                                      if (!in_array("Other", ${(in_array($col, $subject_cols) ? "subject" : $col)."_options_array"})) {
                                          array_push(${(in_array($col, $subject_cols) ? "subject" : $col)."_options_array"}, "Other");
                                      }
                                  } else {
                                      if (!in_array($field, $others)) {
                                          if(!in_array($row[$col], ${(in_array($col, $subject_cols) ? "subject" : $col)."_options_array"})){
                                              array_push(${(in_array($col, $subject_cols) ? "subject" : $col)."_options_array"}, $row[$col]);
                                          }
                                      } else {
                                          if (!in_array($row[$col], ${(in_array($col, $subject_cols) ? "subject" : $col)."_options"})) {
                                              array_push(${(in_array($col, $subject_cols) ? "subject" : $col)."_options_array"}, "Other");
                                          } else {
                                              array_push(${(in_array($col, $subject_cols) ? "subject" : $col)."_options_array"}, $row[$col]);
                                          }
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
                        foreach ($cols as $col) {
                          if (array_key_exists($col, $row)) {
                            if (strpos($row[$col], '|') !== false) {
                                foreach (${(in_array($col, $subject_cols) ? "subject" : $col)."_options_array"} as $key => $field_option) {
                                    $field_array = explode('|', $row[$col]);
                                    foreach ($field_array as $field_array_value) {
                                        if (startsWith(trim($field_array_value), "OTHER:") && "Other" == $field_option) {
                                            ${"field_option_$key"}++;
                                            ${$field."_output"}["Other"] = ${"field_option_$key"};
                                        } else {
                                            if (!in_array($col, $others)) {
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
                              foreach (${(in_array($col, $subject_cols) ? "subject" : $col)."_options_array"} as $key => $field_option){
                                if (startsWith($row[$col], "OTHER:") && "Other" == $field_option) {
                                  ${"field_option_$key"}++;
                                  ${$field."_output"}["Other"] = ${"field_option_$key"};
                                } else {
                                  if (!in_array($field, $others)) {
                                    if ($row[$col] == $field_option) {
                                      if ($row[$col] != "" && $row[$col] != null && $row[$col] != "null") {
                                        ${"field_option_$key"}++;
                                        ${$field."_output"}[$row[$col]] = ${"field_option_$key"};
                                      }
                                    }
                                  } else {
                                    if (!in_array($row[$col], ${$field."_options"})) {
                                      if ("Other" == $field_option) {
                                        ${"field_option_$key"}++;
                                        ${$field."_output"}["Other"] = ${"field_option_$key"};
                                      }
                                    } else {
                                      if ($row[$col] == $field_option) {
                                        ${"field_option_$key"}++;
                                        ${$field."_output"}[$row[$col]] = ${"field_option_$key"};
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
                    }
                    $output[$field] = ${$field."_output"};
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
