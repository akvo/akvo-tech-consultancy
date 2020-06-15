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
use App\Answer;
use App\Datapoint;
use App\Partnership;

class ChartController extends Controller
{
	public function __construct() {
		$this->echarts = new Echarts();
	}

    public function workStream(Request $request, Question $questions)
    {
        $values = $questions->where('question_id',30100022)
                            ->with('answers.datapoints.country')
                            ->with('options')->first();
        $answers = collect($values->answers)->map(function($answer) {
            return array(
                'country' => $answer->datapoints->country->name,
                'values' => explode('|', $answer->text)
            );
        })->groupBy('country');
        $answers = $answers->map(function($data, $key){
            $list = collect();
            $data->each(function($d) use ($list) {
                $list->push($d['values']);
            });
            return collect($list->flatten(0))->countBy();
        });
        $series = collect($values->options)->map(function($option) use ($answers) {
            $text = $option['text'];
            $data = $answers->map(function($data, $key) use ($answers, $text) {
                if (isset($answers[$key][$text])){
                    return $answers[$key][$text];
                };
                return null;
            });
            return ["name" => $text, "data" => $data->values(), "stack" => "category"];
        });
        $categories = $answers->keys();
        $legends = $series->pluck('name');
		return $this->echarts->generateBarCharts($legends, $categories, "Horizontal", $series);
    }

    public function organisationForms(Request $request, Datapoint $datapoints, Partnership $partnerships)
    {
        $countries = $partnerships->has('childrens')->get();
        $data = $datapoints->select('datapoint_id', 'form_id', 'country_id')
                       ->where('survey_group_id', 2)
                       ->with('forms')
                       ->with('country')
                       ->get()
                       ->transform(function($dt){
                           $dt->form_name = $dt->forms->name;
                           $dt->country_name = $dt->country->name;
                           return $dt->makeHidden(['forms','country']);
                       });
        $projects = $data->groupBy('form_name');
        $series = collect($projects)
            ->map(function($data, $key){
                return $data->countBy('country_name');
            })
            ->map(function($data, $key) use ($countries) {
                $count = collect();
                collect($countries)->each(function($country) use ($data, $key, $count) {
                    $country = $country['name'];
                    if (isset($data[$country])){
                        $count->push($data[$country]);
                        return;
                    }
                    $count->push(null);
                    return;
                });
                return ["name" => $key, "data" => $count, "stack" => "category"];
            })->values();
        $legends = $series->pluck("name");
        $categories = $countries->pluck("name");
		return $this->echarts->generateBarCharts($legends, $categories, "Horizontal", $series);
    }

    public function rnrGender(Request $request, Answer $answers) {
        $femaleold = ['36030007'];
        $femaleyoung = ['24030004'];
        $maleold = ['20030002'];
        $maleyoung = ['24030005'];
        $question_id = collect([$femaleold, $femaleyoung, $maleold, $maleyoung])->flatten(0);
        $all = $answers->whereIn('question_id', $question_id);
        $hasCountry = false;
        if (isset($request->country_id)) {
            $hasCountry = true;
            if ($request->country_id === "0") {
                $hasCountry = false;
            }
            $datapoints_id = $this->filterQuery($request);
            $all = $all->whereIn('datapoint_id',$datapoints_id);
        }
        if ($hasCountry) {
            $all = $all->with('datapoints.partnership')->get()->transform(function($dt){
                $dt->country = $dt->datapoints->partnership->name;
                return $dt->makeHidden('datapoints');
            });
        }
        if (!$hasCountry) {
            $all = $all->with('datapoints.country')->get()->transform(function($dt){
                $dt->country = $dt->datapoints->country->name;
                return $dt->makeHidden('datapoints');
            });
        }
        $legends = ["Female > 35", "Female ≤ 35", "Male > 35", "Male ≤ 35"];
        $all = collect($all)->groupBy('country')->map(function($countries)
            use ($femaleold, $femaleyoung, $maleold, $maleyoung)
        {
            $countries = $countries->map(function($country)
                use ($femaleold, $femaleyoung, $maleold, $maleyoung)
            {
                $country->total = (int) $country->value;
                if (collect($femaleold)->contains($country->question_id)){
                    $country->participant = "Female > 35";
                }
                if (collect($femaleyoung)->contains($country->question_id)){
                    $country->participant = "Female ≤ 35";
                }
                if (collect($maleold)->contains($country->question_id)){
                    $country->participant = "Male > 35";
                }
                if (collect($maleyoung)->contains($country->question_id)){
                    $country->participant = "Male ≤ 35";
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
                    if ($key === "Female ≤ 35"){
                        $femaleyoung->push($dt);
                    }
                    if ($key === "Male > 35"){
                        $maleold->push($dt);
                    }
                    if ($key === "Male ≤ 35"){
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
                if ($legend === "Female ≤ 35"){
                    $values = $femaleyoung;
                }
                if ($legend === "Male > 35"){
                    $values = $maleold;
                }
                if ($legend === "Male ≤ 35"){
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

    public function genderTotal(Request $request, Answer $answers) {
        $femaleold = ['36030007'];
        $femaleyoung = ['24030004'];
        $maleold = ['20030002'];
        $maleyoung = ['24030005'];
        $question_id = collect([$femaleold, $femaleyoung, $maleold, $maleyoung])->flatten(0);
        $all = $answers->whereIn('question_id', $question_id);
        if (isset($request->country_id)) {
            $datapoints_id = $this->filterQuery($request);
            $all = $all->whereIn('datapoint_id',$datapoints_id);
        }
        $all = $all->get();
        $legends = ["Female > 35", "Female ≤ 35", "Male > 35", "Male ≤ 35"];
        $series = collect($all)->map(function($dt)
            use ($femaleold, $femaleyoung, $maleold, $maleyoung ){
                $dt->answer = (int) $dt->answer;
                if (collect($femaleold)->contains($dt->question_id)){
                    $dt->participant = "Female > 35";
                }
                if (collect($femaleyoung)->contains($dt->question_id)){
                    $dt->participant = "Female ≤ 35";
                }
                if (collect($maleold)->contains($dt->question_id)){
                    $dt->participant = "Male > 35";
                }
                if (collect($maleyoung)->contains($dt->question_id)){
                    $dt->participant = "Male ≤ 35";
                }
                return $dt;
            })->groupBy('participant')->map(function($part, $key){
                return array(
                    $key => $part->sum('text')
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

    public function countryTotal(Request $request, Answer $answers) {
        $question_id = ['36030007', '24030004', '20030002', '24030005'];
        $answers = $answers->whereIn('question_id', $question_id);
        $hasCountry = false;
        if (isset($request->country_id)) {
            $hasCountry = true;
            if ($request->country_id === "0") {
                $hasCountry = false;
            }
            $datapoints_id = $this->filterQuery($request);
            $answers= $answers->whereIn('datapoint_id',$datapoints_id);
        }
        if ($hasCountry) {
            $answers = $answers->with('datapoints.partnership')->get()->transform(function($data){
                return [
                    'name' => Str::before($data->datapoints->partnership->name, '_'),
                    'value' => $data->value,
                ];
            });
        }
        if (!$hasCountry) {
            $answers = $answers->with('datapoints.country')->get()->transform(function($data){
                return [
                    'name' => $data->datapoints->country->name,
                    'value' => $data->value,
                ];
            });
        }
        $answers = $answers->groupBy('name')->map(function($dt, $key) {
                return $dt->map(function($d){return $d['value'];})->sum();
        });
        $legends = $answers->keys();
        $series = collect($answers)->map(function($data, $key){
            return array(
                "name"=>$key,
                "value"=>$data,
            );
        })->values();
		return $this->echarts->generateDonutCharts($legends, $series);
    }

    private function filterPartnership($request, $results) {

        $filter_country = false;
        $filter_partner = false;

        if (isset($request->country_id)) {
            $filter_country = true;
            if ($request->country_id === "0") {
                $filter_country = false;
            }
        }

        if (isset($request->partnership_id)) {
            $filter_partner = true;
            if ($request->partnership_id === "0") {
                $filter_partner = false;
            }
        }

        $survey_codes = collect(config('surveys.forms'))->filter(function($survey){
            return $survey['name'] === "Organisation Forms";
        })->map(function($survey){
            return collect($survey['list'])->values()->map(function($list){
                return $list['form_id'];
            })->flatten(2);
        })->values()->flatten();

        if($filter_country){
            $results = $results->where('parent_id', $request->country_id);
        };
        if ($filter_partner) {
            $results = $results->where('id', $request->partnership_id);
        }
        $results = $results->with('partnership_datapoints')->with('parents')->get();
        $results = collect($results)->map(function($partners) use ($survey_codes) {
            $partnership_dp = collect($partners['partnership_datapoints'])->filter(function($dp) use ($survey_codes) {
                return collect($survey_codes)->contains($dp['form_id']);
            })->count();
            $res['country'] = ($partners['parents'] === null) ? null : $partners['parents']['name'];
            $res['commodity'] = Str::before($partners['name'],'_');
            $res['project'] = Str::after($partners['name'],'_');
            $res['value'] = $partnership_dp;
            return $res;
        });
        $results = $results->reject(function($partners){
            return $partners['value'] === 0;
        })->values();
        return $results;
    }

    public function partnershipCharts(Request $request, Partnership $partnerships, Datapoint $datapoints) {
        $results = $this->filterPartnership($request, $partnerships);
        $results = $results->sortByDesc('value')->values();
        $categories = $results->groupBy('country')->keys();
        $series = $results->groupBy('project')->map(function($countries, $key) use ($results, $categories) {
            $data = collect();
            $categories->each(function($category) use ($countries, $data) {
                $countries->each(function($country) use ($category, $data) {
                    if ($category === $country['country']){
                        $data->push($country['value']);
                    } else {
                        $data->push(null);
                    }
                });
            });
            return [
                "name" => $key,
                "data" => $data,
                "stack" => "project"
            ];
        })->values();
        $type = "Horizontal";
        $legends = $series->map(function($legend){
            return $legend['name'];
        });
        return $this->echarts->generateBarCharts($legends, $categories, $type, $series);
    }

    public function partnershipTotalCharts(Request $request, Partnership $partnerships, Datapoint $datapoints) {
        $results = $this->filterPartnership($request, $partnerships);
        $series = $results->groupBy('country')->map(function($data, $key){
            $data = $data->map(function($val){
                return $val['value'];
            })->sum();
            return [
                "name" => $key,
                "value" => $data,
            ];
        })->values();
        $legends = $series->map(function($d){
            return $d['name'];
        });
		return $this->echarts->generateDonutCharts($legends, $series);
        return $this->echarts->generateBarCharts($legends, $categories, $type, $series);
    }

    public function partnershipCommodityCharts(Request $request, Partnership $partnerships, Datapoint $datapoints) {
        $results = $this->filterPartnership($request, $partnerships);
        $series = $results->groupBy('project')->map(function($data, $key){
            $data = $data->map(function($val){
                return $val['value'];
            })->sum();
            return [
                "name" => $key,
                "value" => $data,
            ];
        })->values();
        $legends = $series->map(function($d){
            return $d['name'];
        });
		$values = $series->map(function($d) {
            return $d['value'];
		});
		return $this->echarts->generateSimpleBarCharts($legends, $values);
    }

    public function genderCount(Request $request, Answer $answers)
    {
        $femaleold = ['36030007'];
        $femaleyoung = ['24030004'];
        $maleold = ['20030002'];
        $maleyoung = ['24030005'];
        $question_id = collect([$femaleold, $femaleyoung, $maleold, $maleyoung])->flatten(0);
        $all = $answers->whereIn('question_id', $question_id);
        if (isset($request->country_id)) {
            $datapoints_id = $this->filterQuery($request);
            $all = $all->whereIn('datapoint_id',$datapoints_id);
        }
        $all = collect($all->get())->map(function($dt, $key) 
            use ($femaleold, $femaleyoung, $maleold, $maleyoung ){
                $dt->answer = (int) $dt->answer;
                if (collect($femaleold)->contains($dt->question_id)){
                    $dt->participant = "Female > 35";
                }
                if (collect($femaleyoung)->contains($dt->question_id)){
                    $dt->participant = "Female ≤ 35";
                }
                if (collect($maleold)->contains($dt->question_id)){
                    $dt->participant = "Male > 35";
                }
                if (collect($maleyoung)->contains($dt->question_id)){
                    $dt->participant = "Male ≤ 35";
                }
                return $dt;
            })->groupBy('participant')->map(function($dt, $key){
                return [
                    "country" => $key,
                    "value" => $dt->sum('value'),
                ];
            })->values();
        return $all;
    }

    public function topThree(Request $request, Partnership $partnerships, Datapoint $datapoints)
    {
        $results = $partnerships;
        $showPartnership = false;
        if (isset($request->country_id)) {
            if($request->country_id !== "0") {
                $showPartnership = true;
            };
        }
        if (!isset($request->country_id)) {
            $showPartnership = false;
        }
        if($showPartnership){
            $results = $results->where('id', $request->country_id)
                ->has('country_datapoints')
                ->with('country_datapoints.partnership')
                ->first()->country_datapoints;
            $results = $results->transform(function($dt){
                return [
                    'country' => $dt->partnership->name,
                    'commodity' => Str::before($dt->partnership->name,'_'),
                    'project' => Str::after($dt->partnership->name,'_')
                ];
            })->groupBy('country');
            $results = collect($results)->map(function($dt, $key) {
                return [
                    'country' => $key,
                    'commodity' => Str::before($key, '_'),
                    'project' => Str::after($key, '_'),
                    'value' => $dt->count(),
                ];
            })->values()->take(4);
            return $results;
        };
        if(!$showPartnership){
            $survey_codes = collect(config('surveys.forms'))->filter(function($survey){
                return $survey['name'] === "Organisation Forms";
            })->map(function($survey){
                return collect($survey['list'])->values()->map(function($list){
                    return $list['form_id'];
                })->flatten(2);
            })->values()->flatten();
            $results = $results->with('partnership_datapoints')->with('parents')->get();
            $results = collect($results)->map(function($partners) use ($survey_codes) {
                $partnership_dp = collect($partners['partnership_datapoints'])->filter(function($dp) use ($survey_codes) {
                    return collect($survey_codes)->contains($dp['form_id']);
                })->count();
                $res['country'] = ($partners['parents'] === null) ? null : $partners['parents']['name'];
                $res['commodity'] = Str::before($partners['name'],'_');
                $res['project'] = Str::after($partners['name'],'_');
                $res['value'] = $partnership_dp;
                return $res;
            });
            $results = $results->reject(function($partners){
                return $partners['value'] === 0;
            })->values();
            $results = $results->sortByDesc('value')->values();
            $partners = $results->take(3);
            $total = [
                'country'=> $results->groupBy('country')->count()." Countries",
                'commodity' => $results->groupBy('commodity')->count(). " Partnerships",
                'project' => $results->groupBy('project')->count(). " Projects",
                'value' => $results->countBy('value')->flatten()->sum()
            ];
            $partners->push($total);
            return $partners;
        }
        $results = collect($results)->push(array(
            'country' => $partnerships->has('childrens')->count(),
            'commodity' => $partnerships->has('parents')->count(),
            'project' => 'Total Projects',
            'value' => $datapoints->count(),
        ));
        return $results;
    }

    public function mapCharts(Request $request, Partnership $partnerships, Datapoint $datapoints)
    {
        $data = $partnerships
            ->has('country_datapoints')
            ->with('country_datapoints')
            ->get()
            ->transform(function($dt){
                return array (
                    'name' => $dt->name,
                    'value' => $dt->country_datapoints->count()
                );
            });
        $min = collect($data)->min('value');
        $max = collect($data)->max('value');
        return $this->echarts->generateMapCharts($data, $min, $max);
    }

	public function hierarchy(Request $request, Answer $answers)
	{
        $organisation_id = [20140003, 28150003, 38120005, 38140006];
        $organisation = $answers->whereIn('question_id',$organisation_id)
                                ->with('questions.form')
                                ->has('datapoints.partnership.parents')
                                ->with('datapoints.partnership.parents')->get()
                                ->transform(function($dt){
                                    return array(
                                        'country' => $dt->datapoints->partnership->parents->name,
                                        'partnership' => $dt->datapoints->partnership->name,
                                        'organisation' => $dt->text,
                                        'projects' => $dt->questions->form->name
                                    );
                                });
        $organisation = collect($organisation)->groupBy('country')->map(function($data, $country){
            $partnership = $data->groupBy("partnership")->map(function($data, $partnership) {
                $projects = $data->groupBy("projects")->map(function($data, $project){
                    return array(
                        "name" => $project,
                        "value" => "projects",
                        "children" => $data->map(function($data){
                            return array(
                                "name" => $data["organisation"],
                                "value" => "organisation",
                                "itemStyle" => array("color" => "#ff4444"),
                                "label" => array("fontSize" => 10),
                            );
                        }),
                        "itemStyle" => array("color" => "#ffbb33"),
                        "label" => array("fontSize" => 10)
                    );
                })->values();
                return array(
                    "name" => $partnership,
                    "value" => "partnership",
                    "children" => $projects,
                    "itemStyle" => array("color" => "#00C851"),
                    "label" => array("fontSize" => 12),
                );
            })->values();
            return array(
                "name" => $country,
                "value" => "countries",
                "children" => $partnership,
                "itemStyle" => array("color" => "#33b5e5"),
                "label" => array("fontSize" =>  15),
            );
        })->values();
        return array(
            "name" => "2Scale",
            "value" => "Global",
            "children" => $organisation,
            "itemStyle" => array("color" => "#aa66cc"),
            "label" => array("fontSize" => 20),
        );
	}

    private function filterQuery($request) {
        $country_id = false;
        $partnerships_id = false;
        $datapoints = Datapoint::select('id');
        if(isset($request->country_id) && $request->country_id !== "0"){
            $country_id = $request->country_id;
            $datapoints = $datapoints->where('country_id',$country_id);
        }
        if(isset($request->partnership_id) && $request->partnership_id !== "0"){
            $partnerships_id = $request->partnership_id;
            $datapoints = $datapoints->where('partnership_id',$partnerships_id);
        }
        return $datapoints->get()->pluck('id');
    }

}
