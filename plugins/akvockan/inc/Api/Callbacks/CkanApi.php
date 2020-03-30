<?php 
/**
 * @package  AkvoCkanPlugin
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
        $start = 1;
        $paged = 1;
        if (isset($_GET['paged'])) {
            $start = $_GET['paged'] * 10 + 1;
            $paged = $_GET['paged'];
        } 
        $request = $client->request("GET", 
			$this->url . $this->version . "package_search?rows=50&start=".$start."&q=", [
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
        var_dump($records);
        return $records;
	}

    public function getTotalResources( ) {
        $client = new \GuzzleHttp\Client();
        $search_url = $this->url . $this->version . "resource_search?query=name:";
        $request = $client->request("GET", $search_url, [
            'headers' => [
                'Authorization' => $this->key,
                'Accept' => 'application/json']
            ]
        );
        $records = json_decode($request->getBody())->result->count;
    }

    public function searchData( ) {
        $records = [];
        $client = new \GuzzleHttp\Client();
        if (isset($_GET['q'])) {
            $q = $_GET['q'];
            $search_url = $this->url . $this->version . "package_search?rows=50&q=" . $q; 
            $request = $client->request("GET", $search_url, [
                'headers' => [
                    'Authorization' => $this->key,
                    'Accept' => 'application/json']
                ]
            );
            $records = json_decode($request->getBody())->result->results;
        }
        if (isset($_GET['id'])) {
            $q = $_GET['id'];
            $search_url = $this->url . $this->version . "package_show?id=" . $q; 
            $request = $client->request("GET", $search_url, [
                'headers' => [
                    'Authorization' => $this->key,
                    'Accept' => 'application/json']
                ]
            );
            $records = json_decode($request->getBody())->result;
        }
        if (isset($_GET['visual'])) {
            $name = $_GET['name'];
            $search_url = $this->url . $this->version . "resource_view_list?id=" . $_GET['visual']; 
            $request = $client->request("GET", 
                $search_url, [
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
        }
        return $records;
    }

}
