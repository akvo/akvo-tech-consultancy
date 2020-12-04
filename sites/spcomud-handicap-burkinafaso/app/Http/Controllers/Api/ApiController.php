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

    public function getSurveys(Request $requests) 
    {
        return \App\Survey::with('forms')->get();
    }

    public function data(Request $requests, Answer $answers)
    {
        $data = \App\Bridge::all();
        $config = collect(config('query.values'));
        return [
            'data' => $data,
            'options' => $this->filters($config, 'options', $data),
            'cascades' => $this->filters($config, 'cascades', $data),
            'config' => $config->except(['id','value','bridge']),
        ];
    }

    public function getMaps(Request $requests)
    {
        if (!isset($requests->form_id)) {
            return response("Not Found", 404);
        }

        $configs = config('maps.'.$requests->form_id);
        $questions = \App\Question::where('form_id', $requests->form_id)->get();
        
        return [
            "first_filter" => $this->generateMapConfig($configs['first_filter'], $questions),
            "second_filter" => $this->generateMapConfig($configs['second_filter'], $questions),
        ];
    }

    public function getMapsData(Request $requests)
    {
        if (!isset($requests->form_id)) {
            return response("Not Found", 404);
        }

        $fids = \App\FormInstance::where('form_id', $requests->form_id)->get()->pluck('id');
        $answers = \App\Answer::whereIn('form_instance_id', $fids)->get()
                    ->groupBy('form_instance_id')->values();
        return $answers;
    }

    private function generateMapConfig($data, $questions)
    {
        $results = collect($data)->map(function ($x) use ($questions) {
            $question = $questions->firstWhere('id', $x['question_id']);
            $text = ($x['text'] !== null) ? $x['text'] : $question['name'];
            
            if ($question['type'] === 'option') {
                $options = \App\Option::where('question_id', $x['question_id'])->get();
                $values = $options->map(function ($opt, $idx) use ($x) {
                    if ($x['options'] !== null) {
                        $opt_cfg = collect($x['options'])->firstWhere('code', $opt['code']);
                        $text = ($opt_cfg['text'] !== null) ? $opt_cfg['text'] : $opt['name'];
                        $color = ($opt_cfg['color'] !== null) ? $opt_cfg['color'] : null;
                        return [
                            "id" => $opt['id'],
                            "text" => Str::ucfirst($text),
                            "color" => $color,
                            "order" => $opt_cfg['order'],
                        ];
                    }
                    return [
                        "id" => $opt['id'],
                        "text" => Str::ucfirst($opt['name']),
                        "color" => null,
                        "order" => $idx,
                    ];
                })->sortBy('order')->values()->all();
            }

            if ($question['type'] === 'cascade') {
                $cascades = \App\Cascade::where('parent_id', $question['cascade_id'])->get();
                $values = $cascades->map(function ($cascade, $idx) use ($x) {
                    return [
                        "id" => $cascade['id'],
                        "text" => Str::ucfirst($cascade['name']),
                        "order" => $idx,
                    ];
                })->sortBy('order')->values()->all();
            }

            return [
                "question_id" => $x['question_id'],
                "text" => Str::ucfirst($text),
                "type" => $question['type'],
                "order" => $x['order'],
                "values" => $values,
            ];            
        })->sortBy('order')->values()->all();
        
        return $results;
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

    // public function getCovidStatus (Request $request)
    // {
    //     $client = new \GuzzleHttp\Client();
    //     $types = ["Active","Confirmed","Deaths","Recovered"];
    //     $values = collect();
    //     foreach ($types as $type) {
    //         $response = $client->get("https://services5.arcgis.com/YfKU4zOjO3YYNdSW/arcgis/rest/services/UGACovidCases/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22".$type."%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&resultType=standard&cacheHint=true");
    //         $data = json_decode($response->getBody(), true);
    //         $values[$type] = $data["features"][0]["attributes"]["value"];
    //     }
    //     return $values;
    // }

    // public function getCovidStatusByDistrict(Request $request)
    // {
    //     $client = new \GuzzleHttp\Client();
    //     $url = "https://services5.arcgis.com/YfKU4zOjO3YYNdSW/arcgis/rest/services/UGACovidCases/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=true&spatialRel=esriSpatialRelIntersects&maxAllowableOffset=1222&geometry=%7B%22xmin%22%3A3130860.6785550043%2C%22ymin%22%3A0.000004984438419342041%2C%22xmax%22%3A3757032.814267002%2C%22ymax%22%3A626172.1357169822%2C%22spatialReference%22%3A%7B%22wkid%22%3A102100%2C%22latestWkid%22%3A3857%7D%7D&geometryType=esriGeometryEnvelope&inSR=102100&outFields=*&outSR=102100&resultType=tile";
    //     $response = $client->get($url);
    //     $data = json_decode($response->getBody(), true);
    //     $results = collect($data['features'])->map(function($item) {
    //         $temp = collect($item['attributes'])->only(['DName2019', 'Confirmed', 'Active', 'Recovered', 'Deaths']);
    //         return [
    //             "name" => $temp['DName2019'],
    //             "confirmed" => $temp['Confirmed'],
    //             "active" => $temp['Active'],
    //             "recovered" => $temp['Recovered'],
    //             "deaths" => $temp['Deaths'],
    //         ];
    //     })->reject(function($item) {
    //         if ($item['confirmed'] === 0 && $item['active'] === 0 && $item['recovered'] === 0 && $item['deaths'] === 0) {
    //             return $item;
    //         } 
    //     })->values();
    //     return $results;
    // }

}
