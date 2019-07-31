<?php 
/**
 * @package  TckanPlugin
 */
namespace Inc\Api\Callbacks;

use Inc\Base\BaseController;

class CkanApi extends BaseController
{
	public function __construct() {
		$this->version = "/api/3/action/";
        $this->key = esc_attr( get_option( 'api_key' ) );
        $this->url = esc_attr( get_option( 'ckan_url' ) );
	}

    public function getData() {
        $client = new \GuzzleHttp\Client();
        $request = $client->request("GET", 
			$this->url . $this->version . "package_search?q=", [
            'headers' => [
				'Authorization' => $this->key,
				'Accept' => 'application/json']
			]
		);
        $records = json_decode($request->getBody());
        return $records;
    }

    public function getOrganisation() {
        $client = new \GuzzleHttp\Client();
        $request = $client->request("GET", 
			$url->url . $this->version . "organization_list", [
            'headers' => [
				'Authorization' => $this->key,
				'Accept' => 'application/json']
			]
		);
        $records = json_decode($request->getBody());
        return $records;
    }

	public function getResourceView($id, $name) {
        $client = new \GuzzleHttp\Client();
        $request = $client->request("GET", 
			$this->url . $this->version . "resource_view_list?id=" . $id, [
            'headers' => [
				'Authorization' => $this->key,
				'Accept' => 'application/json']
			]
		);
        $records = json_decode($request->getBody());
		$records = $records->result;
		$records = array_map(function($rec) use ($name){
			$link = $this->url . "/dataset/" . $name . "/resource/" . $rec->resource_id. "/view/" . $rec->id; 
			return array( 
				"title" => $rec->title,
				"embedd" => $link
			); 
		}, $records);
        return $records;
	}
}
