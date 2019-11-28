<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use App\Libraries\Akvo;
use App\Libraries\Helpers;
use App\Libraries\Echarts;
use App\Question;
use App\Data;

class ChartController extends Controller
{
	public function __construct() {
		$this->echarts = new Echarts();
	}

    public function workStream(Request $request, Data $data)
    {
        $values = $data->where('form_id', 20020001)
					->where('question_id',30100022)->get();
		$categories = collect($values)->map(function($value) {
			return $value->country;
		})->unique()->values()->toArray();
		$values = collect($values)->groupBy('answer')->toArray();
		$values = collect($values)->map(function($value) use ($categories){
			$value = collect($value)->countBy('country');
			$series = collect();
			forEach($categories as $category) {
				$data = Arr::get($value, $category,null);
				if ($value->has($category)) {
					$data = Arr::get($value, $category, $value[$category]);
				}
				$series->push($data);
			}
			return $series;
		});
		$legends = $values->keys();
	 	$series = collect();	
		$type = "Horizontal";
		forEach($legends as $legend) {
			$series->push(array(
				"name" => $legend,
				"data" => $values[$legend],
				"stack" => "category",
			));
		}
		return $this->echarts->generateBarCharts($legends, $categories, $type, $series);
    }

    public function organisationForms(Request $request, Data $data)
    {
        $orgforms = [30160001, 4100001, 30200004, 14170009];
        $values = $data->select('country','datapoint_id','form_id','question_id')
                       ->whereIn('form_id', $orgforms)
                       ->groupBy('datapoint_id')
                       ->with('forms')
                       ->get();
		$categories = collect($values)->map(function($value) {
			return $value->country;
		})->unique()->values()->toArray();
        $values = collect($values)->map(function($value){
            $value->form_name = $value->forms->form_name;
            return collect($value)->forget('forms');
        })->groupBy('form_name')->toArray();
		$values = collect($values)->map(function($value) use ($categories){
			$value = collect($value)->countBy('country');
			$series = collect();
			forEach($categories as $category) {
				$data = Arr::get($value, $category,null);
				if ($value->has($category)) {
					$data = Arr::get($value, $category, $value[$category]);
				}
				$series->push($data);
			}
			return $series;
		});
		$legends = $values->keys();
	 	$series = collect();	
		$type = "Horizontal";
		forEach($legends as $legend) {
			$series->push(array(
				"name" => $legend,
				"data" => $values[$legend],
				"stack" => "Organisation Forms",
			));
		}
		return $this->echarts->generateBarCharts($legends, $categories, $type, $series);
    }

    public function rnrGender(Request $request, Data $data) {
        $femaleold = ['36030007'];
        $femaleyoung = ['24030004'];
        $maleold = ['20030002'];
        $maleyoung = ['24030005'];
        $question_id = collect($femaleold)
            ->concat($femaleyoung)
            ->concat($maleold)
            ->concat($maleyoung);
        $all = $data->select('country', 'form_id', 'question_id', 'answer')
                       ->whereIn('question_id', $question_id)
                       ->get();
        $legends = ["Female > 35", "Female < 35", "Male > 35", "Male < 35"];
        $all = collect($all)->groupBy('country')->map(function($countries) 
            use ($femaleold, $femaleyoung, $maleold, $maleyoung)
        {
            $countries = $countries->map(function($country) 
                use ($femaleold, $femaleyoung, $maleold, $maleyoung)
            {
                $country->total = (int) $country->answer;
                if (collect($femaleold)->contains($country->question_id)){
                    $country->participant = "Female > 35";
                }
                if (collect($femaleyoung)->contains($country->question_id)){
                    $country->participant = "Female < 35";
                }
                if (collect($maleold)->contains($country->question_id)){
                    $country->participant = "Male > 35";
                }
                if (collect($maleyoung)->contains($country->question_id)){
                    $country->participant = "Male < 35";
                }
                return $country;
            });
            $countries = $countries->groupBy('participant');
            $countries = $countries->map(function($country) {
                return $country->sum('total');
            });
            return $countries;
        });
        $categories = $all->keys();
        $femaleold = collect();
        $femaleyoung = collect();
        $maleold = collect();
        $maleyoung = collect();
        $all = $all->map(function($data) 
            use ($femaleold, $femaleyoung, $maleold, $maleyoung ){
                $data->map(function($dt, $key) 
                use ($femaleold, $femaleyoung, $maleold, $maleyoung ){
                    if ($key === "Female > 35"){
                        $femaleold->push($dt);
                    }
                    if ($key === "Female < 35"){
                        $femaleyoung->push($dt);
                    }
                    if ($key === "Male > 35"){
                        $maleold->push($dt);
                    }
                    if ($key === "Male < 35"){
                        $maleyoung->push($dt);
                    }
                return $dt;
            });
            return $data;
        });
        $series = collect($legends)->map(function($legend)
            use ($femaleold, $femaleyoung, $maleold, $maleyoung ){
                $values = [];
                if ($legend === "Female > 35"){
                    $values = $femaleold;
                }
                if ($legend === "Female < 35"){
                    $values = $femaleyoung;
                }
                if ($legend === "Male > 35"){
                    $values = $maleold;
                }
                if ($legend === "Male < 35"){
                    $values = $maleyoung;
                }
            return array(
				"name" => $legend,
				"data" => $values,
				"stack" => "Gender",
            );
        });
		$type = "Horizontal";
		return $this->echarts->generateBarCharts($legends, $categories, $type, $series);
    }

    public function rnrGenderTotal(Request $request, Data $data) {
        $femaleold = ['36030007'];
        $femaleyoung = ['24030004'];
        $maleold = ['20030002'];
        $maleyoung = ['24030005'];
        $question_id = collect($femaleold)
            ->concat($femaleyoung)
            ->concat($maleold)
            ->concat($maleyoung);
        $all = $data->select('country', 'form_id', 'question_id', 'answer')
                       ->whereIn('question_id', $question_id)
                       ->get();
        $legends = ["Female > 35", "Female < 35", "Male > 35", "Male < 35"];
        $series = collect($all)->map(function($dt)
            use ($femaleold, $femaleyoung, $maleold, $maleyoung ){
                $dt->answer = (int) $dt->answer;
                if (collect($femaleold)->contains($dt->question_id)){
                    $dt->participant = "Female > 35";
                }
                if (collect($femaleyoung)->contains($dt->question_id)){
                    $dt->participant = "Female < 35";
                }
                if (collect($maleold)->contains($dt->question_id)){
                    $dt->participant = "Male > 35";
                }
                if (collect($maleyoung)->contains($dt->question_id)){
                    $dt->participant = "Male < 35";
                }
                return $dt;
            })->groupBy('participant')->map(function($part, $key){
                return array(
                    $key => $part->sum('answer')
                );
            });
        $legends = $series->keys();
        $series = collect($series)->map(function($data, $key){
            return array(
                "name"=>$key,
                "value"=>$data[$key],
            );
        })->values();
		return $this->echarts->generateDonutCharts($legends, $series);
    }

    public function rnrGenderCountry(Request $request, Data $data) {
        $femaleold = ['36030007'];
        $femaleyoung = ['24030004'];
        $maleold = ['20030002'];
        $maleyoung = ['24030005'];
        $question_id = collect($femaleold)
            ->concat($femaleyoung)
            ->concat($maleold)
            ->concat($maleyoung);
        $all = $data->select('country', 'form_id', 'question_id', 'answer')
                       ->whereIn('question_id', $question_id)
                       ->get();
        $series = collect($all)->map(function($dt) {
                $dt->answer = (int) $dt->answer;
                return $dt;
            })->groupBy('country')->map(function($part, $key){
                return array(
                    $key => $part->sum('answer')
                );
            });
        $legends = $series->keys();
        $series = collect($series)->map(function($data, $key){
            return array(
                "name"=>$key,
                "value"=>$data[$key],
            );
        })->values();
		return $this->echarts->generateDonutCharts($legends, $series);
    }

    public function topThree(Request $request, Data $data)
    {
        $all = $data->select('country', 'form_id', 'question_id', 'answer')
                       ->where('question_id', 30200015)
                       ->get();
        $values = collect($all)->countBy('answer')->sort()->reverse()->take(3);
        $results = collect();
        $values = collect($values)->map(function($data, $key) use ($results) {
            $key = explode("|", $key);
            if(Str::contains($key[0],":")) {
                $key[0] = explode(":", $key[0])[1];
            }
            $project = explode("_", $key[1]);
            $data = array(
                'country' => $key[0],
                'commodity' => $project[0],
                'project' => $project[1],
                'value' => $data,
            );
            $results->push($data);
            return $data;
        });
        $tsubmissions = collect($all)->count();
        $tcountries = collect($all)->groupBy('country')->unique()->count();
        $tprojects = collect($all)->groupBy('answer')->unique()->count();
        $results->push(array(
            'country' => $tcountries.' Countries',
            'commodity' => $tprojects,
            'project' => 'Total Projects',
            'value' => $tsubmissions,
        ));
        return $results;
    }

    public function mapCharts(Request $request, Data $data) 
    {
        $values = $data->select('country', 'form_id', 'question_id')
                       ->where('question_id', 30200015)
                       ->get();
        $values = collect($values)->countBy('country');
        $min = $values->flatten()->min();
        $max = $values->flatten()->max();
        $data = collect();
        $values->each( function($value, $key) use ($data) {
            $dt = array(
                "name" => $key,
                "value" => $value 
            ); 
            $data->push($dt);
        });
        return $this->echarts->generateMapCharts($data, $min, $max);
    }

	public function hierarchy(Request $request, Data $data)
	{
        $cascades_id = [20150001, 4100002, 36120005, 36100005];
        $organisation_id = [20140003, 28150003, 38120005, 38140006];
        $question_id = collect($cascades_id)->concat($organisation_id);
		$answers = $data->whereIn('question_id', $question_id)->with('forms')->get();
		$answers = collect($answers)->groupBy('datapoint_id');
        $results = collect();
        $answers = $answers->map(function($dt) use ($cascades_id, $organisation_id, $results) {
            $new_data = collect();
            collect($dt)->map(function($d) use ($cascades_id, $organisation_id, $new_data) {
                if (collect($cascades_id)->contains($d->question_id)) {
                    $new_data["form_id"] = $d->form_id;
                    $new_data["service"] = $d->forms->form_name;
                    $new_data["country"] = $d->country;
                    $project = explode("|",$d->answer)[1];
                    if (Str::contains(":", $project)) {
                        $project = explode(":", $project)[1];
                    }
                    $new_data["project"] = $project;
                } 
                if (collect($organisation_id)->contains($d->question_id)) {
                    $new_data["form_id"] = $d->form_id;
                    $new_data["service"] = $d->forms->form_name;
                    $new_data["country"] = $d->country;
                    $new_data["organisation"] = Str::limit($d->answer, 10);
                } 
                return;
            });
            $results->push($new_data);
            return $new_data;
        });
        $results = $results->groupBy('country')->map(function($result, $key){
            $projects = collect();
            $result = $result->groupBy('project');
            $result = $result->map(function($res, $key) use ($projects) {
                $services = collect();
                $res = $res->groupBy('service');
                $res = $res->map(function($r, $key) use ($services)  {
                    $children = $r->map(function($child) {
                        return array(
                            "name" => $child["organisation"],
                            "value" => "organisations",
                            "itemStyle" => array(
                                "color" => "#ff4444",
                            ),
                            "label" => array(
                                "fontSize" => 10 
                            ),
                        );
                    });
                    $children = array (
                        "name" => $key,
                        "value" => "services",
                        "children" => $children,
                        "itemStyle" => array(
                            "color" => "#ffbb33"
                        ),
                        "label" => array(
                            "fontSize" => 10 
                        ),
                    );
                    $services->push($children);
                    return $children;
                });
                $projects->push(array(
                    "name" => $key,
                    "value" => "projects",
                    "children" => $services,
                    "itemStyle" => array(
                        "color" => "#00C851"
                    ),
                    "label" => array(
                        "fontSize" => 12 
                    ),
                ));
                return $services;
            });
            return array(
                "name" => $key,
                "value" => "countries",
                "children" => $projects,
                "itemStyle" => array(
                    "color" => "#33b5e5"
                ),
                "label" => array(
                    "fontSize" =>  15 
                ),
            );
        });
        return array(
            "name" => "2Scale",
            "value" => "Global",
            "children" => $results->values(),
            "itemStyle" => array(
                "color" => "#aa66cc"
            ),
            "label" => array(
                "fontSize" => 20 
            ),
        );
	}

}
