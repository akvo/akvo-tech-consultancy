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
		$legends = collect($values)->map(function($value) {
			return $value->answer;
		})->unique()->values()->toArray();
		$values = collect($values)->groupBy('country')->toArray();
		$values = collect($values)->map(function($value) use ($legends){
			$value = collect($value)->countBy('answer');
			$series = collect();
			forEach($legends as $legend) {
				$data = Arr::get($value, $legend,0);
				if ($value->has($legend)) {
					$data = Arr::get($value, $legend, $value[$legend]);
				}
				$series->push($data);
			}
			return $series;
		});
		$categories = $values->keys();
	 	$series = collect();	
		$type = "Horizontal";
		forEach($categories as $category) {
			$series->push(array(
				"name" => $category,
				"data" => $values[$category],
				"stack" => $category,
			));
		}
		return $this->echarts->generateBarCharts($legends, $categories, $type, $series);
		return $values;
    }

    public function chartsById(Request $request, Question $questions)
    {
    }

}
