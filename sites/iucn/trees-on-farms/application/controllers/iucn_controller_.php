<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Iucn_controller extends CI_Controller {
    public function __construct(){
        parent::__construct();
        $this->load->helper('url');
        $this->load->helper('functions');
    }

    public function index(){
        $data = array();

        $data['visualisation_details'] = array(
            'table' => 'tof_28030003',
            'columns' => array(
                'q4800002' => array(
                    'title' => "Report on",
                    'type' => "pie",
                    'style' => array()
                ),
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
                'q670002' => array(
                    'title' => "Link to result framework",
                    'type' => "vbar",
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
            'year' => '',
            'layer_url' => '',
            'map_column' => "", //column to use to style the map. Can be set to blank if map is not to be styled
            'map_interactivity' => array(
                "identifier",
                "submitter",
                "q4800002"), //if multiple, separate with commas
            'popup_title' => "q4800002",
            'boundaries_layer' => "",
            'link_title' => 'Bomba',
            'cartocss' => ''
        );
        $data['title'] = "Trees on Farms";
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
            $event_type = $this->input->post('event_type');

            $query = "SELECT identifier, submitter, collection_date, q4800002, q20080001, q22140004 FROM tof_28030003";
            $query .= ($filter != '') ? " WHERE $filter = '$filter_value'" : "";
            $query .= ($event_type != '') ? (($filter != '') ? " AND " : " WHERE ")." q4800002 = '$event_type'" : "";

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

        if (!empty($this->input->post())){
            $filter = ($this->input->post('filter') != "") ? $filters[$this->input->post('filter')] : "";
            $filter_value = $this->input->post('filter_value');
            $event_type = $this->input->post('event_type');

            $query = "SELECT submitter, q10170002, collection_date, q4800002, q670002, q20080001 FROM tof_28030003";
            $query .= ($filter != '') ? " WHERE $filter = '$filter_value'" : "";
            $query .= ($event_type != '') ? (($filter != '') ? " AND " : " WHERE ")." q4800002 = '$event_type'" : "";

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


        if(!empty($this->input->post())){
            $filter = ($this->input->post('filter') != "") ? $filters[$this->input->post('filter')] : "";
            $filter_value = $this->input->post('filter_value');
            $event_type = $this->input->post('event_type');

            $fields_array = $this->input->post('fields');
            $fields = array();
            foreach ($fields_array as $field) {
              if ($field == "sex") {
                array_push($fields, "q9760001", "q18170004");
              } else {
                array_push($fields, $field);
              }
            }

            $query = "SELECT identifier, ".implode(", ", $fields)." FROM ".$this->input->post('survey');
            $query .= ($filter != '') ? " WHERE $filter = '$filter_value'" : "";
            $query .= ($event_type != '') ? (($filter != '') ? " AND " : " WHERE ")." q4800002 = '$event_type'" : "";

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
                      $output["sex"]["Female"] += $row["q9760001"];
                      $output["sex"]["Male"] += $row["q18170004"];
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
                    foreach ($response_array['rows'] as $row){
                        if (!in_array($row['identifier'], ${$field."_identifiers"})) {
                            if (array_key_exists($field, $row)) {
                                if (strpos($row[$field], '|') !== false) {
                                    foreach (${$field."_options_array"} as $key => $field_option){
                                        $field_array = explode('|', $row[$field]);
                                        foreach ($field_array as $field_array_value){
                                            if (startsWith(trim($field_array_value), "OTHER:") && "Other" == $field_option) {
                                                ${"field_option_$key"}++;
                                                ${$field."_output"}["Other"] = ${"field_option_$key"};
                                            } else {
                                                if (!in_array($field, $others)) {
                                                    if(trim($field_array_value) == $field_option){
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

    public function get_point_data(){
        $output = array();
        $cartodb_api_key = "0344aaf6dba34f9786bbbc90805b8bc5143043eb";
        if (!empty($this->input->post())) {
            $query = "SELECT * FROM ".$this->input->post('survey')." WHERE identifier = '".$this->input->post('identifier')."'";

            $url = "https://akvo.cartodb.com/api/v2/sql?q=".urlencode($query)."&api_key=$cartodb_api_key";
            $response = curl_get_data($url);

            //convert response to array
            $response_array = json_decode($response, true);

            if (!empty($response_array['rows'])) {
                $output = $response_array['rows'][0];
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

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */
