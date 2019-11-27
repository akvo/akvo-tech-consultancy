<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
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
        $values = $data->select('country','datapoint_id','form_id')
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

}
