<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Arr;
use App\Bridge;
use App\Option;
use App\Answer;

class ApiController extends Controller
{

    public function __construct()
    {
        $this->collection = collect();
    }

    public function data(Request $requests, Answer $answers)
    {
        $data = \App\Bridge::all();
        $config = collect(config('query.values'));
        return [
            'data' => $data,
            'options' => $this->filters($config, 'options', $data),
            'cascades' => $this->filters($config, 'cascades', $data),
            'config' => $config->except(['id','value','bridge'])
        ];
    }

    private function filters($config, $type, $data)
    {
        $config = $config->where('on',$type)->values()->pluck('name')->toArray();
        return collect($data)->map(function($d) use ($config, $type) {
            $list = collect($d)->only($config)->flatten();
            $selector = new \App\Cascade();
            if ($type === "options") {
                $selector = \App\Option::select('id','code','name');
            }
            return $selector->whereIn('id',$list)->get();
        })->flatten()->unique('id')->values();
    }

    public function getCovidStatus (Request $request)
    {
        $client = new \GuzzleHttp\Client();
        $types = ["Active","Confirmed","Deaths","Recovered"];
        $values = collect();
        foreach ($types as $type) {
            $response = $client->get("https://services5.arcgis.com/YfKU4zOjO3YYNdSW/arcgis/rest/services/UGACovidCases/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22".$type."%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&resultType=standard&cacheHint=true");
            $data = json_decode($response->getBody(), true);
            $values[$type] = $data["features"][0]["attributes"]["value"];
        }
        return $values;
    }

}
