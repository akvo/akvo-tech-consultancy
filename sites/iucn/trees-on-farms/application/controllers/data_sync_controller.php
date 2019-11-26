<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
ini_set('auto_detect_line_endings', TRUE);
ini_set('MAX_EXECUTION_TIME', -1);

class Data_sync_controller extends CI_Controller {
	public function __construct(){
		header('Access-Control-Allow-Origin: *');
		header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
		header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
		$method = $_SERVER['REQUEST_METHOD'];
		if($method == "OPTIONS") {
			die();
		}
		parent::__construct();
		$this->load->helper('url');
		$this->load->helper('functions');
	}

	public function sync_data($instance_name, $survey_group_id, $time=null){
		$cartodb_api_key = "0344aaf6dba34f9786bbbc90805b8bc5143043eb";

		$surveys = $this->surveys($instance_name, $survey_group_id);

		if (array_key_exists("surveys", $surveys)) {
			foreach ($surveys["surveys"] as $survey) {
				$survey_id = $survey["keyId"];
				/*create a table*/
				$columns = array(
						"the_geom geometry(Geometry,4326)",
						"the_geom_webmercator geometry(Geometry,3857)",
						"identifier text",
						"instance text",
						"submitter text",
						"collection_date text",
						"latitude numeric",
						"longitude numeric"
				);
				//pull questions
				$questions = $this->questions($instance_name, $survey_id);
				foreach ($questions['questions'] as $question) {
					if ($question['type'] == "GEO") {
						if (!$question['localeLocationFlag']) {
							array_push($columns, "q".$question['keyId']." text");
						}
					} else {
						array_push($columns, "q".$question['keyId']." text");
					}
				}
				$create_table_query = "CREATE TABLE IF NOT EXISTS public.tof_$survey_id (".implode(", ", $columns)."); \nSELECT cdb_cartodbfytable('tof_".$survey_id."');";
				$create_table_url = "https://akvo.cartodb.com/api/v2/sql?q=".urlencode($create_table_query)."&api_key=$cartodb_api_key";
				curl_get_data($create_table_url);
				/*end create table*/

				/*pull and upload instances and question answers*/
				$instances = $this->survey_instances($instance_name, $survey_id, $time);
				foreach ($instances as $instance) {
					$instance_values = array(
							"identifier" => "'".$instance['surveyedLocaleIdentifier']."'",
							"instance" => "'".$instance['keyId']."'",
							"submitter" => "'".str_replace("'", "''", $instance['submitterName'])."'",
							"collection_date" => "'".$instance['collectionDate']."'"
					);

					//pull answers
					$answers = $this->question_answers($instance_name, $instance['keyId']);
					foreach ($answers['question_answers'] as $answer) {
						if (!empty($answer['value'])) {
							foreach ($questions['questions'] as $question) {
								if ($answer['questionID'] == $question['keyId']) {
									if ($question['type'] == "GEO") {
										if ($question['localeLocationFlag']) {
											$coordinates = explode("|", $answer['value']);
											$instance_values['latitude'] = $coordinates[0];
											$instance_values['longitude'] = $coordinates[1];
										} else {
											$instance_values["q".$question['keyId']] = "'".str_replace("'", "''", $answer['value'])."'";
										}
									} else {
										if ($question['type'] == "SIGNATURE") {
											$signature = json_decode($answer['value'], true);
											$instance_values["q".$question['keyId']] = "'".str_replace("'", "''", ((array_key_exists("name", $signature)) ? $signature["name"] : ""))."'";
										} else {
											$instance_values["q".$question['keyId']] = "'".str_replace("'", "''", $answer['value'])."'";
										}
									}
								}
							}
						}
					}
					//end pull answers

					$upload_instance_query = "INSERT INTO tof_$survey_id (".implode(", ", array_keys($instance_values)).") SELECT ".implode(", ", $instance_values)
					." WHERE NOT EXISTS (SELECT instance FROM tof_$survey_id WHERE instance = '".$instance['keyId']."')";
					$upload_instance_url = "https://akvo.cartodb.com/api/v2/sql?q=".urlencode($upload_instance_query)."&api_key=$cartodb_api_key";
					$upload_instance_response = curl_get_data($upload_instance_url);
					echo "$upload_instance_response\n\n";
				}
				/*end upload instances and question answers*/

				/*update geom*/
				$update_geom_query = "UPDATE tof_$survey_id SET the_geom = ST_SetSRID(st_makepoint(longitude, latitude),4326)";
				$update_geom_url = "https://akvo.cartodb.com/api/v2/sql?q=".urlencode($update_geom_query)."&api_key=$cartodb_api_key";
				$update_geom_response = curl_get_data($update_geom_url);
				echo "$update_geom_response\n";
				/*end update geom*/
			}
		}

		//$this->merge_data();
	}

	//return all associated point data when passed identifier
	public function point_data($identifier, $survey_group_id) {
		$this->load->driver('cache');

		$output = array();
		$cartodb_api_key = "0344aaf6dba34f9786bbbc90805b8bc5143043eb";
		$surveys = unserialize(include('resources/data/550001.php'));

		//$surveys = $this->surveys("akvoflow-165", $survey_group_id);
		//echo serialize($surveys);die();
		$cartoData = $this->cache->file->get('identifier_' . $identifier);

		foreach ($surveys['forms'][0]['questionGroups'][0]['questions'] as $survey) {
			//$output[$survey['name']] = array();
			/*
			//get all instance IDs associated with point
			$instance_ID_query = "SELECT * FROM tof_".$surveys['forms'][0]['id']." WHERE identifier = '$identifier'";
			$instance_ID_url = "https://akvo.cartodb.com/api/v2/sql?q=".urlencode($instance_ID_query)."&api_key=$cartodb_api_key";
			$instance_ID_response = curl_get_data($instance_ID_url);
			//echo "$instance_ID_query\n$instance_ID_response";
			$instance_ID_response_array = json_decode($instance_ID_response, true);
			*/
			if ($cartoData) {
				$output[] = [
					'date' => $cartoData['collection_date'],
					'question' => $survey['name'],
					'value' => isset($cartoData['q' . $survey['id']]) ? $cartoData['q' . $survey['id']] : '',
					'type' => $survey['type']
				];
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

	private function surveys($instance_name, $survey_group_id = ""){
		$output = array();
		$dashboard_data = $this->dashboards_data($instance_name);
		if($dashboard_data !== false){
			$get_data_object = array();
			$get_data_object['access_key'] = $dashboard_data['access_key'];
			$get_data_object['secret'] = $dashboard_data['secret'];
			$get_data_object['instance_name'] = $dashboard_data['instance_name'];
			$get_data_object['requested_resource'] = "surveys";
			if($survey_group_id !== ""){
				$get_data_object['conditions'] = "/$survey_group_id";
			}

			$data = $this->get_data2($get_data_object);

			$output = json_decode($data, true);
		}
		return $output;
	}

	private function survey_groups($instance_name, $survey_group_id = ""){
		$output = array();
		$dashboard_data = $this->dashboards_data($instance_name);
		if($dashboard_data !== false){
			$get_data_object = array();
			$get_data_object['access_key'] = $dashboard_data['access_key'];
			$get_data_object['secret'] = $dashboard_data['secret'];
			$get_data_object['instance_name'] = $dashboard_data['instance_name'];
			$get_data_object['requested_resource'] = "survey_groups";
			if($survey_group_id !== ""){
				$get_data_object['conditions'] = "/$survey_group_id";
			}

			$data = $this->get_data($get_data_object);

			$output = json_decode($data, true);
		}
		return $output;
	}

	//only supports pulling questions from specific because apparently form = survey?
	private function questions($instance_name, $survey_id, $question_group_id=null){
		$output = array();
		$dashboard_data = $this->dashboards_data($instance_name);
		if($dashboard_data !== false){
			$get_data_object = array();
			$get_data_object['access_key'] = $dashboard_data['access_key'];
			$get_data_object['secret'] = $dashboard_data['secret'];
			$get_data_object['instance_name'] = $dashboard_data['instance_name'];
			$get_data_object['requested_resource'] = "questions";
			$get_data_object['conditions'] = "?surveyId=$survey_id".(($question_group_id) ? "&questionGroupId=$question_group_id" : "");

			$data = $this->get_data($get_data_object);

			$output = json_decode($data, true);
		}
		return $output;
	}

	private function question_groups($instance_name, $survey_id){
		$output = array();
		$dashboard_data = $this->dashboards_data($instance_name);
		if($dashboard_data !== false){
			$get_data_object = array();
			$get_data_object['access_key'] = $dashboard_data['access_key'];
			$get_data_object['secret'] = $dashboard_data['secret'];
			$get_data_object['instance_name'] = $dashboard_data['instance_name'];
			$get_data_object['requested_resource'] = "question_groups";
			$get_data_object['conditions'] = "?surveyId=$survey_id";

			$data = $this->get_data($get_data_object);

			$output = json_decode($data, true);
		}
		return $output;
	}

	private function survey_instances($instance_name, $survey_id, $begin_date=null, $end_date=null){
		$output = array();
		$instances_output = array();
		$dashboard_data = $this->dashboards_data($instance_name);
		if ($dashboard_data !== false) {
			$get_data_object = array();
			$get_data_object['access_key'] = $dashboard_data['access_key'];
			$get_data_object['secret'] = $dashboard_data['secret'];
			$get_data_object['instance_name'] = $dashboard_data['instance_name'];
			$get_data_object['requested_resource'] = "survey_instances";
			$get_data_object['conditions'] = "?surveyId=$survey_id".(($begin_date) ? "&beginDate=$begin_date" : "");
			$data = $this->get_data($get_data_object);

			$instances = json_decode($data, true);

			if ($instances['meta']['num'] > 0) {
				foreach ($instances['survey_instances'] as $instance) {
					array_push($output, $instance);
				}
			}

			if ($instances['meta']['num'] === 20) {
				while ($instances['meta']['num'] === 20) {
					$get_data_object['conditions'] = "?surveyId=$survey_id".(($begin_date) ? "&beginDate=$begin_date" : "")."&since=".$instances['meta']['since'];
					$data = $this->get_data($get_data_object);

					$instances = json_decode($data, true);

					if ($instances['meta']['num'] > 0) {
						foreach ($instances['survey_instances'] as $instance) {
							array_push($output, $instance);
						}
					}
				}
			}
		}
		return $output;
	}

	private function question_answers($instance_name, $instance_id){
		$output = array();
		$dashboard_data = $this->dashboards_data($instance_name);
		if($dashboard_data !== false){
			$get_data_object = array();
			$get_data_object['access_key'] = $dashboard_data['access_key'];
			$get_data_object['secret'] = $dashboard_data['secret'];
			$get_data_object['instance_name'] = $dashboard_data['instance_name'];
			$get_data_object['requested_resource'] = "question_answers";
			$get_data_object['conditions'] = "?surveyInstanceId=$instance_id";

			$data = $this->get_data($get_data_object);

			$output = json_decode($data, true);
		}
		return $output;
	}

	private function dashboards_data($instance_name = ""){
		if(file_exists("resources/data/dashboards.csv" )){
			$csv = array_map("str_getcsv", file("resources/data/dashboards.csv", FILE_SKIP_EMPTY_LINES));
			$keys = array_shift($csv);
			foreach ($csv as $i=>$row){
				$csv[$i] = array_combine($keys, $row);
			}

			if($instance_name !== ""){
				foreach ($csv as $dashboard_row){
					if($dashboard_row['instance_name'] === $instance_name){
						return $dashboard_row;
					}
				}
			}else{
				return $csv;
			}
		}
		return false;
	}

	private function get_data($get_data_object){
		$url = "https://".$get_data_object['instance_name'].".appspot.com/api/v1/".$get_data_object['requested_resource'].((array_key_exists('conditions', $get_data_object)) ? $get_data_object['conditions'] : "");
		$date = time(); // UNIX timestamp

		$payload = "GET\n$date\n" . "/api/v1/".$get_data_object['requested_resource'];
		$signature = base64_encode(hash_hmac("sha1", $payload, $get_data_object['secret'], TRUE));

		$curl = curl_init();
		curl_setopt($curl, CURLOPT_URL, $url);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array("Date: $date", "Authorization: ".$get_data_object['access_key'].":$signature"));
		$response = curl_exec($curl);
		curl_close($curl);
		return $response;
	}

	private function get_data2($get_data_object){
		$this->load->driver('cache');
		$accessToken = $this->cache->get('access_token');

		if (!$accessToken) {
			$url = 'https://login.akvo.org/auth/realms/akvo/protocol/openid-connect/token';
			$ch = curl_init();

			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_POST, 1);
			curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
				'client_id' => 'curl',
				'username' => '',
				'password' => '',
				'grant_type' => 'password',
				'scope' => 'openid offline_access'
			] ));

			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			$serverOutput = curl_exec($ch);
			curl_close ($ch);

			$data = json_decode($serverOutput);
			if (isset($data->access_token)) {
				$accessToken = $data->access_token;
				$this->cache->file->save('access_token', $data->access_token, 240);
			}
		}

		//$url = 'https://api.akvo.org/flow/orgs' . '/' . 'iucn/form_instances?form_id=28030003&survey_id=550001';
		//$url = 'https://api.akvo.org/flow/orgs' . '/' . 'iucn/surveys/550001';
		$url = 'https://api.akvo.org/flow/orgs' . '/iucn/' . $get_data_object['requested_resource'].((array_key_exists('conditions', $get_data_object)) ? $get_data_object['conditions'] : "");

		$curl = curl_init();
		curl_setopt($curl, CURLOPT_URL, $url);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($curl, CURLOPT_HTTPHEADER, [
			"Authorization: Bearer " . $accessToken,
			"Accept: application/vnd.akvo.flow.v2+json",
			"User-Agent: Curl"
		]);

		$response = curl_exec($curl);
		curl_close($curl);
		return $response;
	}
}
