<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class ApiController extends Controller
{

	public function test() 
	{
		$client = new \GuzzleHttp\Client();
		$api = 'https://rsr.akvo.org/rest/v1/project_directory?organisation=2103&format=json&limit=100';
		$header = ['Authorization' => 'Token 7d9a17639015b614a8026868dcc0f90fe38a4268'];
		$response = $client->get($api, ['headers'=>$header]);
		$response = json_decode($response->getBody());
		$response = collect($response);
		$response['location'] = collect($response['location'])->map(function($data){
			$data->name =  trim($data->name);
			return $data;
		});
		$organisations = collect($response['organisation']);
		$sectors = collect($response['sector'])->map(function($sector) {
			$sector->id = (int) $sector->id;
			return $sector;
		});
		$response['projects'] = collect($response['projects'])->map(function($data) use ($organisations, $sectors) {
			$data->organisations = collect($data->organisations)->map(function($org) use ($organisations) {
				return $organisations->where('id', $org)->first();
			});
			$data->sectors = collect($data->sectors)->map(function($sec) use ($sectors) {
				return $sectors->where('id', (int) $sec)->first();
			})->filter()->values();
			return $data;
		});
		return $response->except(['page_size_default', 'custom_fields','showing_cached_projects']);
	}
}
