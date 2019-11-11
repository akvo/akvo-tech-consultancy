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
            'table' => 'iucn_7160001',
            'columns' => array(
                'q6140001' => array(
                    'title' => "Report on",
                    'column' => "q6140001",
                    'style' => array()
                ),
                'q210007' => array(
                    'title' => "Link to project result framework",
                    'column' => "q210007",
                    'style' => array()
                ),
                'q2150002' => array(
                    'title' => "Type of activity",
                    'column' => "q2150002",
                    'style' => array()
                ),
                'q8160001' => array(
                    'title' => "Scale/level of activity",
                    'column' => "q8160001",
                    'style' => array()
                ),
                'q9080003' => array(
                    'title' => "Main subject",
                    'column' => "q9080003",
                    'style' => array()
                ),
                'q7170001' => array(
                    'title' => "Main participants",
                    'column' => "q7170001",
                    'style' => array()
                )
            ),
            'forms' => array("PLUS Form"),
            'survey_group_id' => "2130003",
            'year' => '',
            'layer_url' => '',
            'map_column' => "", //column to use to style the map. Can be set to blank if map is not to be styled
            'map_interactivity' => array(
                "identifier",
                "submitter",
                "q6140001"), //if multiple, separate with commas
            'popup_title' => "q6140001",
            'boundaries_layer' => "",
            'link_title' => 'Bomba',
            'cartocss' => ''
        );
        $data['title'] = "IUCN";
        $data['source'] = "Akvo Flow";
        $data['source_link'] = "https://iucn.akvoflow.org";
        $data['levels'] = array(
            "Local",
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
            'country' => 'q2160001'
        );
        $levels = array(
            "Local" => 0,
            "Regional" => 1,
            "National" => 2,
            "International" => 3
        );
        
        if (!empty($this->input->post())){
            $filter = ($this->input->post('filter') != "") ? $filters[$this->input->post('filter')] : "";
            $filter_value = $this->input->post('filter_value');
            $event_type = $this->input->post('event_type');
            
            $query = "SELECT identifier, submitter, collection_date, q6140001, q2150002, q8160001 FROM iucn_7160001";
            $query .= ($filter != '') ? " WHERE $filter = '$filter_value'" : "";
            $query .= ($event_type != '') ? (($filter != '') ? " AND " : " WHERE ")." q6140001 = '$event_type'" : "";
            
            $url = "http://akvo.cartodb.com/api/v2/sql?q=".urlencode($query)."&api_key=$cartodb_api_key";
            $response = curl_get_data($url);
            
            //convert response to array
            $response_array = json_decode($response, true);
            
            if (!empty($response_array['rows'])){
                $types = array();
                foreach ($response_array['rows'] as $row){
                    if (!in_array($row['q6140001'], $types) && !empty($row['q6140001'])){
                        array_push($types, $row['q6140001']);
                    }
                }
                foreach ($types as $type){
                    $type_output = array();
                    $type_output['name'] = $type;
                    //$type_output['color'] = "";
                    $type_output['data'] = array();
                    foreach ($response_array['rows'] as $row){
                        if ($row['q6140001'] == $type && in_array($row['q8160001'], array_keys($levels))){
                            array_push($type_output['data'], array(
                                'name' => $row['submitter'],
                                'x' => intval($row['collection_date']),
                                'y' => $levels[$row['q8160001']],
                                'color' => ($row['q6140001'] == "Activity") ? "#ea2aca" : "#012700")
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
            'country' => 'q2160001'
        );
        
        if (!empty($this->input->post())){
            $filter = ($this->input->post('filter') != "") ? $filters[$this->input->post('filter')] : "";
            $filter_value = $this->input->post('filter_value');
            $event_type = $this->input->post('event_type');
            
            $query = "SELECT submitter, collection_date, q6140001, q210007, q2150002 FROM iucn_7160001";
            $query .= ($filter != '') ? " WHERE $filter = '$filter_value'" : "";
            $query .= ($event_type != '') ? (($filter != '') ? " AND " : " WHERE ")." q6140001 = '$event_type'" : "";
            
            $url = "http://akvo.cartodb.com/api/v2/sql?q=".urlencode($query)."&api_key=$cartodb_api_key";
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
            'country' => 'q2160001'
        );
        $others = array("q2150002","q9080003","q7170001");
        $q2150002_options = array("Field action","Training","Meeting");
        $q9080003_options = array("Policy, laws, regulations","Governance arrangements","Actions on the ground","Land Use Dialogue");
        $q7170001_options = array("Local Government","National Government","CSO","Private Sector","NGO","Academia","Governance Working Group","Traditional Authority");
        
        
        if(!empty($this->input->post())){
            $filter = ($this->input->post('filter') != "") ? $filters[$this->input->post('filter')] : "";
            $filter_value = $this->input->post('filter_value');
            $event_type = $this->input->post('event_type');
            
            $fields = $this->input->post('fields');
            
            $query = "SELECT identifier, ".implode(", ", $fields)." FROM ".$this->input->post('survey');
            $query .= ($filter != '') ? " WHERE $filter = '$filter_value'" : "";
            $query .= ($event_type != '') ? (($filter != '') ? " AND " : " WHERE ")." q6140001 = '$event_type'" : "";
            
            $url = "http://akvo.cartodb.com/api/v2/sql?q=".urlencode($query)."&api_key=$cartodb_api_key";
            $response = curl_get_data($url);
            
            //convert response to array
            $response_array = json_decode($response, true);
            
            if (!empty($response_array['rows'])) {
                foreach ($fields as $field){
                    ${$field."_output"} = array();
                    ${$field."_options_array"} = array();
                    
                    foreach ($response_array['rows'] as $row){
                        if(array_key_exists($field, $row)){
                            if (strpos($row[$field], '|') !== false) {
                                $field_array = explode('|', $row[$field]);
                                foreach ($field_array as $field_array_value){
                                    //Check for other because Flow
                                    if (startsWith(trim($field_array_value), "OTHER:")) {
                                        if (!in_array("Other", ${$field."_options_array"})) {
                                            array_push(${$field."_options_array"}, "Other");
                                        }
                                    } else {
                                        if (!in_array($field, $others)) {
                                            if(!in_array(trim($field_array_value), ${$field."_options_array"})){
                                                array_push(${$field."_options_array"}, trim($field_array_value));
                                            }
                                        } else {
                                            if (!in_array(trim($field_array_value), ${$field."_options"})) {
                                                if (!in_array("Other", ${$field."_options_array"})) {
                                                    array_push(${$field."_options_array"}, "Other");
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
                            ${$field."_output"}[$field_option] = array(
                                "count" => 0
                            );
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
                                                ${$field."_output"}["Other"]['count'] = ${"field_option_$key"};
                                            } else {
                                                if (!in_array($field, $others)) {
                                                    if(trim($field_array_value) == $field_option){
                                                        ${"field_option_$key"}++;
                                                        ${$field."_output"}[trim($field_array_value)]['count'] = ${"field_option_$key"};
                                                    }
                                                } else {
                                                    if (!in_array(trim($field_array_value), ${$field."_options"})) {
                                                        if ("Other" == $field_option) {
                                                            ${"field_option_$key"}++;
                                                            ${$field."_output"}["Other"]['count'] = ${"field_option_$key"};
                                                        }
                                                    } else {
                                                        if(trim($field_array_value) == $field_option){
                                                            ${"field_option_$key"}++;
                                                            ${$field."_output"}[trim($field_array_value)]['count'] = ${"field_option_$key"};
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
                                            ${$field."_output"}["Other"]['count'] = ${"field_option_$key"};
                                        } else {
                                            if (!in_array($field, $others)) {
                                                if ($row[$field] == $field_option) {
                                                    if ($row[$field] != "" && $row[$field] != null && $row[$field] != "null") {
                                                        ${"field_option_$key"}++;
                                                        ${$field."_output"}[$row[$field]]['count'] = ${"field_option_$key"};
                                                    }
                                                }
                                            } else {
                                                if (!in_array($row[$field], ${$field."_options"})) {
                                                    if ("Other" == $field_option) {
                                                        ${"field_option_$key"}++;
                                                        ${$field."_output"}["Other"]['count'] = ${"field_option_$key"};
                                                    }
                                                } else {
                                                    if ($row[$field] == $field_option) {
                                                        ${"field_option_$key"}++;
                                                        ${$field."_output"}[$row[$field]]['count'] = ${"field_option_$key"};
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
            
            $url = "http://akvo.cartodb.com/api/v2/sql?q=".urlencode($query)."&api_key=$cartodb_api_key";
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