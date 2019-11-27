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
        $organisaation_id = [20150001, 4100002, 36120005, 36100005];
		$answers = $data->whereIn('form_id', $orgforms)->get();
		return collect($answers)->groupBy('datapoint_id');
		$answers= collect($answers)->map(function($dt) {
            $key = explode("|", $dt->answer);
            if(Str::contains($key[0],":")) {
                $key[0] = explode(":", $key[0])[1];
            }
            if(Str::contains($key[1],":")) {
                $key[1] = explode(":", $key[1])[1];
            }
            $dt->country = $key[0];
            $dt->project = $key[1];
			$dt->form_name = $dt->forms->form_name;
			return collect($dt)->forget(['forms','submission_date','datapoint_id','id','answer'])->toArray();
		});
	 	$levels = $answers->groupBy('country')->map(function($data) {
			$dataset = collect($data)->groupby('project');
			$dataset = collect($dataset)->map(function($ds) {
				// return collect($ds)->groupby('form_name')->keys();
				return collect($ds)->groupby('form_name');
			});
			return $dataset;
		});	
		return $levels;
	}

}
