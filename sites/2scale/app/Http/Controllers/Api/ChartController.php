<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Libraries\Akvo;
use App\Libraries\Helpers;
use App\Libraries\Echarts;
use App\Question;
use App\Answer;
use App\Datapoint;
use App\Partnership;
use App\Sector;
use App\Option;

class ChartController extends Controller
{
	public function __construct() {
        $this->echarts = new Echarts();
        $this->collections = collect();
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
        if (count($answers) === 0) {
            return response('no data available', 503);
        };
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
        if (count($data) === 0) {
            return response('no data available', 503);
        };
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
        if (isset($request->country_id) || isset($request->start)) {
            $hasCountry = true;
            if ($request->country_id === "0") {
                $hasCountry = false;
            }
            $datapoints_id = $this->filterQuery($request);
            $all = $all->whereIn('datapoint_id',$datapoints_id);
        }
        if ($hasCountry) {
            $all = $all->with('datapoints.partnership')->get()->transform(function($dt){
                $dt->country = ($dt->datapoints->partnership === null) ? "NA" : $dt->datapoints->partnership->name;
                return $dt->makeHidden('datapoints');
            });
        }
        if (!$hasCountry) {
            $all = $all->with('datapoints.country')->get()->transform(function($dt){
                $dt->country = ($dt->datapoints->country->name === null) ? "NA" : $dt->datapoints->country->name;
                return $dt->makeHidden('datapoints');
            });
        }
        if (count($all) === 0) {
            return response('no data available', 503);
        };
        $legends = ["Female > 35", "Female ≤ 35", "Male > 35", "Male ≤ 35"];
        $all = collect($all)->sortByDesc('country')->values()->groupBy('country')->map(function($countries)
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
        if (isset($request->country_id) || isset($request->start)) {
            $datapoints_id = $this->filterQuery($request);
            $all = $all->whereIn('datapoint_id',$datapoints_id);
        }
        $all = $all->get();
        if (count($all) === 0) {
            return response('no data available', 503);
        };
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
        if (isset($request->country_id) || isset($request->start)) {
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
        if (count($answers) === 0) {
            return response('no data available', 503);
        };
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
        $start = new Carbon('2018-01-01');
        $end = new Carbon(date("Y-m-d"));

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

        if (isset($request->start)){
            $start = new Carbon($request->start);
            $end = new Carbon($request->end);
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
        if (count($results) === 0) {
            return response('no data available', 503);
        };

        $results = collect($results)->map(function($partners) use ($survey_codes, $start, $end) {
            $partnership_dp = collect($partners['partnership_datapoints'])->filter(function($dp) use ($survey_codes) {
                return collect($survey_codes)->contains($dp['form_id']);
            });
            $partnership_dp = $partnership_dp->map(function($dp){
                return ["date" => new Carbon(date($dp["submission_date"]))];
            })->values();
            $partnership_dp = $partnership_dp->whereBetween('date', [$start, $end]);
            $res['country'] = ($partners['parents'] === null) ? null : $partners['parents']['name'];
            $res['commodity'] = Str::before($partners['name'],'_');
            $res['project'] = Str::after($partners['name'],'_');
            $res['value'] = $partnership_dp->count();
            return $res;
        });
        $results = $results->reject(function($partners){
            return $partners['value'] === 0;
        })->values();
        return $results;
    }

    public function partnershipCharts(Request $request, Partnership $partnerships, Datapoint $datapoints) {
        $results = $this->filterPartnership($request, $partnerships);
        if (count($results) === 0) {
            return response('no data available', 503);
        };
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
        if (count($results) === 0) {
            return response('no data available', 503);
        };
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
        if (count($results) === 0) {
            return response('no data available', 503);
        };
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
        $start = new Carbon('2018-01-01');
        $end = new Carbon(date("Y-m-d"));
        if (isset($request->country_id)) {
            if($request->country_id !== "0") {
                $showPartnership = true;
            };
        }
        if (!isset($request->country_id)) {
            $showPartnership = false;
        }
        if (isset($request->start)) {
            $start = new Carbon($request->start);
            $end = new Carbon($request->end);
        }
        if($showPartnership){
            $results = $results->where('id', $request->country_id)
                ->has('country_datapoints')
                ->with('country_datapoints.partnership')
                ->first();
            if (!$results) {
                return response('no data available', 503);

            }
            $results = $results->country_datapoints->transform(function($dt){
                return [
                    'country' => $dt->partnership->name,
                    'commodity' => Str::before($dt->partnership->name,'_'),
                    'project' => Str::after($dt->partnership->name,'_'),
                    'date' => new Carbon($dt->submission_date)
                ];
            })->groupBy('country');
            $results = collect($results)->map(function($dt, $key) use ($start, $end) {
                $filtered_date = collect($dt)->whereBetween('date', [$start, $end]);
                return [
                    'country' => $key,
                    'commodity' => Str::before($key, '_'),
                    'project' => Str::after($key, '_'),
                    'value' => $filtered_date->count(),
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
            $results = $results
                ->has('partnership_datapoints')
                ->with('partnership_datapoints.partnership')
                ->with('parents')
                ->get();
            $results = collect($results)->map(function($partners) use ($survey_codes, $start, $end) {
                $partnership_dp = collect($partners['partnership_datapoints'])
                    ->filter(function($dp) use ($survey_codes) {
                    return collect($survey_codes)->contains($dp['form_id']);
                });
                $partnership_dp = $partnership_dp->map(function($dp){
                    return ["date" => new Carbon(date($dp["submission_date"]))];
                })->values();
                $partnership_dp = $partnership_dp->whereBetween('date', [$start, $end]);
                $res['country'] = ($partners['parents'] === null) ? null : $partners['parents']['name'];
                $res['commodity'] = Str::before($partners['name'],'_');
                $res['project'] = Str::after($partners['name'],'_');
                $res['value'] = count($partnership_dp);
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
        //$organisation_id = [20140003, 28150003, 38120005, 38140006];
        $organisation_id = [14180001, 28150003, 38120005, 38140006];
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
                                "name" => str_replace('_',' ', $data["organisation"]),
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
            "name" => "2SCALE",
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
        if(isset($request->start)){
            $start = date($request->start);
            $end = date($request->end);
            $datapoints = $datapoints->whereBetween('submission_date',[$start, $end]);
        };
        return $datapoints->get()->pluck('id');
    }

    public function getRsrDatatable(Request $request)
    {
        $partnershipId = null;
        if (isset($request->country_id) && $request->country_id !== "0") {
            $partnershipId = $request->country_id;
        }
        if (isset($request->partnership_id) && $request->partnership_id !== "0") {
            $partnershipId = $request->country_id; // generate datatables just from country level
            // $partnershipId = $request->partnership_id; // generate datatables from partnership level
        }

        $data = \App\RsrProject::where('partnership_id', $partnershipId)
                ->with(['rsr_results' => function ($query) {
                    $query->orderBy('order');
                    $query->with('rsr_indicators.rsr_dimensions.rsr_dimension_values');
                    $query->with('rsr_indicators.rsr_periods.rsr_period_dimension_values');
                    $query->with(['childrens' => function ($query) {
                        $query->orderBy('order');
                        $query->with('rsr_indicators.rsr_dimensions.rsr_dimension_values');
                        $query->with('rsr_indicators.rsr_periods.rsr_period_dimension_values');
                        $query->with(['childrens' => function ($query) {
                            $query->orderBy('order');
                            $query->with('rsr_indicators.rsr_dimensions.rsr_dimension_values');
                            $query->with('rsr_indicators.rsr_periods.rsr_period_dimension_values');
                        }]);
                    }]);
                }])->first();

        $this->collections = collect();
        $data = $data['rsr_results']->transform(function ($res) {
            $res['parent_project'] = null;
            $res['level'] = 1;
            $res = $this->aggregateRsrValues($res);
            $res = $this->aggregateRsrChildrenValues($res, 2);
            $res = Arr::except($res, ['childrens']);
            $res['columns'] = [
                'id' => $res['id'],
                'title' => '# of '.Str::after($res['title'], ': '),
                'subtitle' => [],
            ];
            if ($res['rsr_indicators_count'] > 1 && count($res['rsr_dimensions']) === 0) {
                $subtitles = collect();
                $res['rsr_indicators']->each(function ($ind) use ($subtitles) {
                    $subtitles->push([
                        "name" => $ind['title'],
                        "values" => [],
                    ]);
                });
                $res['columns']= [
                    'id' => $res['id'],
                    'title' => '# of '.Str::after($res['title'], ': '),
                    'subtitle' => $subtitles,
                ];
            }
            if (count($res['rsr_dimensions']) > 0 && $res['rsr_indicators_count'] === 1) {
                # UII 8 : As in RSR
                $subtitles = collect();
                $res['rsr_dimensions']->each(function ($dim) use ($subtitles) {
                    $subtitles->push([
                        "name" => $dim['name'],
                        "values" => $dim['rsr_dimension_values']->pluck('name'),
                    ]);
                });
                $res['columns'] = [
                    'id' => $res['id'],
                    'title' => '# of '.Str::after($res['title'], ': '),
                    'subtitle' => $subtitles,
                ];
                # EOL UII 8 : As in RSR
            }
            if (count($res['rsr_dimensions']) > 0 && $res['rsr_indicators_count'] > 1) {
                # UII 8 : Male-led - Female-led
                // $res['columns'] = $res['rsr_dimensions']->map(function ($dim) use ($res) {
                //     $resultIds = collect(config('akvo-rsr.datatables.uii8_results_ids'));
                //     if ($resultIds->contains($res['id']) || $resultIds->contains($res['parent_result'])) {
                //         $dimensionIds = collect(config('akvo-rsr.datatables.ui8_dimension_ids'));
                //         if ($dimensionIds->contains($dim['id']) || $dimensionIds->contains($dim['parent_dimension_name'])) {
                //             return [
                //                 'id' => $res['id'],
                //                 'title' => '# of '.Str::after($res['title'], ': '),
                //                 'dimension' => $dim['name'],
                //                 'subtitle' => $dim['rsr_dimension_values']->pluck('name'),
                //             ];
                //         }
                //         return;
                //     }
                //     return [
                //         'id' => $res['id'],
                //         'title' => '# of '.Str::after($res['title'], ': '),
                //         'dimension' => $dim['name'],
                //         'subtitle' => $dim['rsr_dimension_values']->pluck('name'),
                //     ];
                // })->reject(function ($dim) {
                //     return $dim === null;
                // })->values()[0];
                # EOL UII 8 : Male-led - Female-led

                # UII 8 : As in RSR
                $subtitles = collect();
                $res['rsr_dimensions']->each(function ($dim) use ($subtitles) {
                    $subtitles->push([
                        "name" => $dim['name'],
                        "values" => $dim['rsr_dimension_values']->pluck('name'),
                    ]);
                });
                $res['rsr_indicators']->each(function ($ind) use ($subtitles) {
                    $subtitles->push([
                        "name" => $ind['title'],
                        "values" => [],
                    ]);
                });
                $res['columns'] = [
                    'id' => $res['id'],
                    'title' => '# of '.Str::after($res['title'], ': '),
                    'subtitle' => $subtitles,
                ];
                # EOL UII 8 : As in RSR
            }
            $this->collections->push($res);
            return $res;
        });

        // $parents = $this->collections->where('level', 1)->values();
        // filter not to show contribution value
        $parents = $this->collections->where('level', 1)->values()->filter(function ($item) { return !Str::contains($item['title'], 'Amount of co-financing') && !Str::contains($item['title'], "2SCALE's Contribution"); })->values();
        $results = $parents->first()->only('rsr_project_id', 'project');
        $results['columns'] = $parents;

        $childs = $this->collections->where('parent_project', $results['rsr_project_id']);
        $results['childrens'] = $childs->unique('project')->values();
        if (count($results['childrens']) > 0) {
            $results['childrens'] = $results['childrens']->transform(function ($child) use ($childs) {
                $child = $child->only('rsr_project_id', 'project');
                // $child['columns'] = $childs->where('rsr_project_id', $child['rsr_project_id'])->values();
                // filter not to show contribution value
                $child['columns'] = $childs->where('rsr_project_id', $child['rsr_project_id'])->values()->filter(function ($item) { return !Str::contains($item['title'], 'Amount of co-financing') && !Str::contains($item['title'], "2SCALE's Contribution"); })->values();

                $childs = $this->collections->where('parent_project', $child['rsr_project_id']);
                $child['childrens'] = $childs->unique('project')->values();
                if (count($child['childrens']) > 0) {
                    $child['childrens'] = $child['childrens']->transform(function ($child) use ($childs) {
                        $child = $child->only('rsr_project_id', 'project');
                        // $child['columns'] = $childs->where('rsr_project_id', $child['rsr_project_id'])->values();
                        // filter not to show contribution value
                        $child['columns'] = $childs->where('rsr_project_id', $child['rsr_project_id'])->values()->filter(function ($item) { return !Str::contains($item['title'], 'Amount of co-financing') && !Str::contains($item['title'], "2SCALE's Contribution"); })->values();
                        return $child;
                    });
                }

                return $child;
            });
        }

        return [
            "config" => [
                "result_ids" => config('akvo-rsr.datatables.uii8_results_ids'),
                "url" => config('akvo-rsr.endpoints.rsr_page'),
            ],
            // "columns" => $data->pluck('columns'),
            // filter not to show contribution value
            "columns" => $data->pluck('columns')->filter(function ($item) { return !Str::contains($item['title'], 'Amount of co-financing') && !Str::contains($item['title'], "2SCALE's Contribution"); })->values(),
            "data" => $results,
        ];
    }

    private function aggregateRsrChildrenValues($res, $level)
    {
        if (count($res['childrens']) === 0) {
            return $res;
        }
        $collections = collect();
        $res['childrens'] = $res['childrens']->transform(function ($child) use ($collections, $res, $level) {
            $child['parent_project'] = $res['rsr_project_id'];
            $child['level'] = $level;
            $child = $this->aggregateRsrValues($child);
            // collect all childs dimensions value
            if (count($child['rsr_dimensions']) > 0) {
                foreach ($child['rsr_dimensions'] as $dim) {
                    $collections->push($dim['rsr_dimension_values']);
                }
            }
            $level += 1;
            $child = $this->aggregateRsrChildrenValues($child, $level);
            $child = Arr::except($child, ['childrens']);
            $this->collections->push($child);
            return $child;
        });
        // aggregate all value from children ( if the parent value 0, take it from children aggregate )
        if ($res['total_target_value'] == 0) {
            $res['total_target_value'] = $res['childrens']->sum('total_target_value');
        }
        if ($res['total_actual_value'] == 0) {
            $res['total_actual_value'] = $res['childrens']->sum('total_actual_value');
        }
        if (count($res['rsr_dimensions']) > 0 && count($res['childrens']) !== 0) {
            // aggregate dimension value
            $res['rsr_dimensions'] = $res['rsr_dimensions']->transform(function ($dim)
                use ($collections) {
                $dim['rsr_dimension_values'] = $dim['rsr_dimension_values']->transform(function ($dimVal)
                    use ($collections) {
                    $values = $collections->flatten(1)->where('parent_dimension_value', $dimVal['id']);
                    if ($dimVal['value'] == 0) {
                        $dimVal['value'] = $values->sum('value');
                    }
                    if ($dimVal['total_actual_value'] == 0) {
                        $dimVal['total_actual_value'] = $values->sum('total_actual_value');
                    }
                    return $dimVal;
                });
                return $dim;
            });
        }
        // eol aggregate all value from children
        return $res;
    }

    private function aggregateRsrValues($res)
    {
        $no_dimension_indicators = collect();
        $res['rsr_indicators'] = $res['rsr_indicators']->transform(function ($ind) use ($no_dimension_indicators) {
            // $ind['target_value'] = $ind['rsr_periods']->sum('target_value');
            $ind['total_actual_value'] = $ind['rsr_periods']->sum('actual_value');
            if ($ind['has_dimension']) {
                // collect dimensions value all period
                $periodDimensionValues = $ind['rsr_periods']->map(function ($per) {
                    return $per['rsr_period_dimension_values'];
                })->flatten(1);
                // aggregate dimension value
                $ind['rsr_dimensions'] = $ind['rsr_dimensions']->transform(function ($dim)
                    use ($periodDimensionValues) {
                    $dim['rsr_dimension_values'] = $dim['rsr_dimension_values']->transform(function ($dimVal)
                        use ($periodDimensionValues) {
                        $dimVal['total_actual_value'] = $periodDimensionValues
                                                        ->where('rsr_dimension_value_id', $dimVal['id'])
                                                        ->sum('value');
                        return $dimVal;
                    });
                    return $dim;
                });
            }
            if (!$ind['has_dimension']) {
                $no_dimension_indicators->push($ind);
            }
            $ind = Arr::except($ind, ['rsr_periods']);
            return $ind;
        });
        $res['rsr_dimensions'] = $res['rsr_indicators']->pluck('rsr_dimensions')->flatten(1);
        $res['total_target_value'] = $res['rsr_indicators']->sum('target_value');
        $res['total_actual_value'] = $res['rsr_indicators']->sum('total_actual_value');
        $res['rsr_indicators_count'] = count($res['rsr_indicators']);
        $res = Arr::except($res, ['rsr_indicators']);
        $res['rsr_indicators'] = $no_dimension_indicators; // separate indicator with no dimension
        return $res;
    }

    public function reportReactReactCard(Request $request)
    {
        $reachReactId = config('akvo-rsr.charts.reachreact.form_id');
        $datapoints = Datapoint::where('form_id', $reachReactId)->get();
        if (isset($request->country_id) && $request->country_id !== "0") {
            $datapoints = $datapoints->where('country_id', $request->country_id);
        }
        if (isset($request->partnership_id) && $request->partnership_id !== "0") {
            $datapoints = $datapoints->where('partnership_id', $request->partnership_id);
        }
        return [
            "title" => config('akvo-rsr.charts.reachreact.title'),
            "value" => count($datapoints),
        ];
    }

    public function reportReachReactBarChart(Request $request)
    {
        $config = config('akvo-rsr.charts.'.$request->type);
        $question = Question::where('question_id', $config['question_id'])->first();
        $options = Option::where('question_id', $question->id)->get();
        $answers = Answer::where('question_id', $config['question_id'])->with('datapoints')->get();
        if (isset($request->country_id) && $request->country_id !== "0") {
            $answers = $answers->where('datapoints.country_id', $request->country_id);
        }
        if (isset($request->partnership_id) && $request->partnership_id !== "0") {
            $answers = $answers->where('datapoints.partnership_id', $request->partnership_id);
        }
        $data = collect();
        $answers->map(function ($answer) use ($data) {
            $values = str_replace('[', '', $answer['options']);
            $values = str_replace(']', '', $values);
            $values = explode(',', $values);
            foreach ($values as $value) {
                $data->push($value);
            }
            return;
        });
        $results = $data->countBy();
        if (count($results) === 0) {
            return response('no data available', 503);
        };
        $series = $options->map(function($option) use ($results, $request) {
            $name = $option['text'];
            if ($request->type === 'target-audience' && Str::contains($option['text'], '(')) {
                $name = explode('(', $option['text']);
                $name = $name[0];
            }
            return [
                "name" => $name,
                "value" => (isset($results[$option['id']])) ? $results[$option['id']] : 0,
            ];
        })->values();
        $legends = $series->map(function($d){
            return $d['name'];
        });
		$values = $series->map(function($d) {
            return $d['value'];
        });
		return $this->echarts->generateSimpleBarCharts($legends, $values, true, true);
    }

    public function homePartnershipMapChart(Request $request, Partnership $partnerships)
    {
        $data = $partnerships
            ->where('level', 'country')
            ->get()
            ->transform(function($d){
                return array (
                    'name' => $d->name,
                    'value' => $d->childrens->count(),
                );
            });
        $min = collect($data)->min('value');
        $max = collect($data)->max('value');
        return $this->echarts->generateMapCharts($data, $min, $max);
    }

    public function homeSectorDistribution(Request $request, Sector $sectors)
    {
        // $forms = collect(config('surveys.forms'));
        // $list = $forms->pluck('list')->flatten(1);
        // $sector_qids = $list->whereNotNull('sector_qid')->pluck('sector_qid');
        // $data = $answers->whereIn('question_id', $sector_qids)->get();
        // $data = $data->map(function ($d) {
        //     $text = explode('|', $d['text']);
        //     $d['level_1'] = $text[0];
        //     $d['level_2'] = (isset($text[1])) ? $text[1] : null;
        //     return $d;
        // });
        // return $data;
        $data = $sectors
        ->where('level', 'industry')
        ->get()
        ->transform(function ($d) {
            return array (
                'name' => $d->name,
                'value' => $d->childrens->count()
            );
        });
        return $this->echarts->generateDonutCharts($data->pluck('name'), $data);
    }

    public function homePartnershipDistribution(Request $request, Partnership $partnerships)
    {
        $data = $partnerships
        ->where('level', 'country')
        ->get()
        ->transform(function($d){
            return array (
                'name' => $d->name,
                'value' => $d->childrens->count()
            );
        });
        return $this->echarts->generateDonutCharts($data->pluck('name'), $data, true);
    }

    private function getUiiValueByConfig($config, $charts)
    {
        $programId = $config['projects']['parent'];
        $partnershipIds = \App\Partnership::where('level', 'partnership')->pluck('id');
        $partnerLevel = \App\RsrProject::whereIn('partnership_id', $partnershipIds)->pluck('id');
        $results = $charts->map(function ($item) {
            // return \App\RsrTitleable::where('rsr_title_id', $item['id'])->get()->pluck('rsr_titleable_id'); // using title id from config give a risk when we reseed the db (can be change)
            $titleId = \App\RsrTitleable::where('rsr_titleable_id', $item['id'])->where('rsr_titleable_type', 'App\RsrResult')->get()->pluck('rsr_title_id');
            return [
                'name' => $item['name'],
                'titleables' => \App\RsrTitleable::whereIn('rsr_title_id', $titleId)->get()->pluck('rsr_titleable_id'),
            ];
        })->map(function ($item) use ($programId, $partnerLevel) {
            $results = \App\RsrResult::whereIn('id', $item['titleables'])->with('rsr_indicators')->get();
            $program = $results->where('rsr_project_id', $programId)->pluck('rsr_indicators')->flatten(1);
            // $partnerships = $results->where('rsr_project_id', '!=', $programId)->pluck('rsr_indicators')->flatten(1)->sum('baseline_value'); // include country
            $partnerships = $results->where('rsr_project_id', '!=', $programId)->whereIn('rsr_project_id', $partnerLevel)->pluck('rsr_indicators')->flatten(1)->sum('baseline_value'); // partnership only
            return [
                "name" => $item['name'],
                "target" => $program->sum('target_value'),
                "toGo" => $program->sum('target_value') - $partnerships,
                "achieved" => $partnerships,
            ];
        })->values();
        return $results;
    }

    public function homeInvestmentTracking(Request $request)
    {
        $config = config('akvo-rsr');
        $investment = collect($config['home_charts']['investment_tracking']);
        $results = $this->getUiiValueByConfig($config, $investment);
        $legend = ["Fund to date", "Fund to go"];
        $categories = $results->pluck('name');
        $dataset = collect();
        $dataset->push(["p_achieved", "p_togo", "achieved", "togo", "target", "name"]);
        foreach ($results as $key => $value) {
            $dataset->push(
                [
                    round(($value["achieved"] / $value["target"]) * 100, 3),
                    round(($value["toGo"] / $value["target"]) * 100, 3),
                    $value["achieved"],
                    $value["toGo"],
                    $value["target"],
                    $value["name"]
                ],
            );
        }
        $series = [
            [
                "name" => "Fund to date",
                "type" => "bar",
                "stack" => "investment",
                "label" => [
                    "show" => true,
                    "fontWeight" => "bold",
                    "position" => "insideBottomRight",
                    "formatter" => "{@p_achieved}%"
                ],
                "encode" => [
                    "x" => "achieved",
                    "y" => "name",
                ]
            ],
            [
                "name" => "Fund to go",
                "type" => "bar",
                "stack" => "investment",
                "label" => [
                    "show" => true,
                    "color" => "#000000",
                    "fontWeight" => "bold",
                    "position" => "insideBottomRight",
                    "formatter" => "{@p_togo}%"
                ],
                "encode" => [
                    "x" => "togo",
                    "y" => "name",
                ]
            ]
        ];
        $xMax = $results->pluck('target')->max();
        return $this->echarts->generateBarCharts($legend, $categories, "Horizontal", $series, $xMax, $dataset);
    }

    public function foodNutritionAndSecurity(Request $request)
    {
        $config = config('akvo-rsr');
        switch ($request->type) {
            case 'food-nutrition-and-security':
                $type = 'food_nutrition_security';
                break;
            case 'private-sector-development':
                $type = 'private_sector_development';
                break;
            case 'input-adittionality':
                $type = 'input_adittionality';
                break;
            default:
                $type = '';
                break;
        }
        $charts = collect($config['impact_react_charts'][$type]);
        $results = $this->getUiiValueByConfig($config, $charts)->sortByDesc(['name']);
        $legend = ["Achieved"];
        $categories = $results->pluck('name');
        $dataset = collect();
        $dataset->push(["p_achieved", "p_togo", "achieved", "togo", "target", "name"]);
        foreach ($results as $key => $value) {
            $dataset->push(
                [
                    round(($value["achieved"] / $value["target"]) * 100, 3),
                    round(($value["toGo"] / $value["target"]) * 100, 3),
                    $value["achieved"],
                    $value["toGo"],
                    $value["target"],
                    $value["name"]
                ],
            );
        }
        $series = [
            [
                "name" => "Achieved",
                "type" => "bar",
                "label" => [
                    "show" => true,
                    "fontWeight" => "bold",
                    "position" => "insideBottomRight",
                    "formatter" => "{@p_achieved}%"
                ],
                "encode" => [
                    "x" => "achieved",
                    "y" => "name",
                ]
            ]
        ];
        $xMax = $results->pluck('target')->max();
        return $this->echarts->generateBarCharts($legend, $categories, "Horizontal", $series, $xMax, $dataset);
    }

    public function reportTotalActivities(Request $request)
    {
        $countries = Partnership::where('level', 'country')
            ->with('country_datapoints')
            ->with('childrens.partnership_datapoints')->get();

        $series = $countries->map(function ($c) {
            $childs = collect($c['childrens'])->map(function ($p) use ($c) {
                return [
                    'name' => $p['name'],
                    'path' => $c['name'].'/'.$p['name'],
                    'value' => count($p['partnership_datapoints']),
                ];
            });
            return [
                'name' => $c['name'],
                'path' => $c['name'],
                'value' => count($c['country_datapoints']),
                'children' => $childs,
            ];
        });
        return $this->echarts->generateTreeMapCharts('Total Activities', $series);
        // $categories = $countries->pluck('name');
        // $series = $countries->map(function ($c) use ($categories) {
        //     return collect($c['childrens'])->map(function ($p) use ($c, $categories) {
        //         $values = collect();
        //         foreach ($categories as $cat) {
        //             if ($c['name'] === $cat) {
        //                 $values->push(count($p['partnership_datapoints']));
        //             } else {
        //                 $values->push(null);
        //             }
        //         }
        //         return [
        //             'name' => $p['name'],
        //             'data' => $values,
        //             'stack' => 'activities',
        //         ];
        //     });
        // })->flatten(1);
        // $type = "Horizontal";
        // $legends = $series->pluck('name');
        // return $this->echarts->generateBarCharts($legends, $categories, $type, $series);
    }

    public function getRsrDatatableByUii(Request $request) {
        $config = config('akvo-rsr');
        // $partnerships = \App\Partnership::get();
        $partnerships = \App\Partnership::where('level', 'partnership')->get();
        $projects = \App\RsrProject::whereIn('partnership_id', $partnerships->pluck('id'))->get();
        // $results = \App\RsrResult::whereIn('rsr_project_id', $projects->pluck('id'))
        $results = \App\RsrResult::where('rsr_project_id', $config['projects']['parent'])
                        ->with('rsr_indicators.rsr_dimensions.rsr_dimension_values')
                        ->with('rsr_indicators.rsr_periods.rsr_period_dimension_values')
                        ->with(['childrens' => function ($q) {
                            $q->with('rsr_indicators.rsr_dimensions.rsr_dimension_values');
                            $q->with('rsr_indicators.rsr_periods.rsr_period_dimension_values');
                            $q->with(['childrens' => function ($q) {
                                $q->with('rsr_indicators.rsr_dimensions.rsr_dimension_values');
                                $q->with('rsr_indicators.rsr_periods.rsr_period_dimension_values');
                            }]);
                        }])->orderBy('order')->get();

        // return $results;
        $uii = $results->pluck('title');
        $collections = collect();
        $this->fetchChildRsrDatatableByUii($collections, $results);
        $data = $collections->whereIn('id', $projects->pluck('id'))->values();
        // return $data;

        $tmp = collect();
        foreach ($uii as $key) {
            $values = $data->where('uii', $key)->values();
            $test['uii'] = $key;
            foreach ($values as $item) {
                $test[$item['project']] = $item['indicators'];
            }
            $tmp->push($test);
        }

        return [
            'uii' => $uii,
            'partnership' => $projects->pluck('title')->sort()->values()->all(),
            'data' => $tmp,
        ];
    }

    private function fetchChildRsrDatatableByUii($collections, $results)
    {
        foreach ($results as $result) {
            // grep indicators data
            if (count($result['rsr_indicators']) > 0) {
                $indicators = $this->fetchIndicatorRsrDatatableByUii($result['rsr_indicators'], $result);
            }
            $temp = collect([
                'uii' => $result['title'],
                'id' => $result['rsr_project_id'],
                'project' => $result['project'],
                'indicators' => $indicators
            ]);
            // $merge = $temp->merge($indicators->first())->all();
            // $collections->push($merge);
            $collections->push($temp);
            if (count($result['childrens']) > 0) {
                $this->fetchChildRsrDatatableByUii($collections, $result['childrens']);
            }
        }
        return $collections;
    }

    private function fetchIndicatorRsrDatatableByUii($indicators, $result)
    {
        $data = $indicators->map(function ($indicator) use ($result) {
            // project name
            $indicator['project'] = $result['project'];
            // populating the periods
            $periodDimensionValues = [];
            if (count($indicator['rsr_periods']) > 0) {
                $periodDimensionValues = $indicator['rsr_periods']->pluck('rsr_period_dimension_values')->flatten(1);
            }
            // populating the dimension
            $indicator['dimensions'] = null;
            if ($indicator['has_dimension'] || count($indicator['rsr_dimensions']) > 0) {
                $indicator['dimensions'] = $indicator['rsr_dimensions']->map(function ($dimension) use ($periodDimensionValues) {
                    $dimension['values'] = $dimension['rsr_dimension_values']->map(function ($dv) use ($periodDimensionValues) {
                        $dv['actual'] = collect($periodDimensionValues)->where('rsr_dimension_value_id', $dv['id'])->sum();
                        return $dv->only('name', 'value', 'actual');
                    });
                    return $dimension->only('name', 'values');
                });
            }
            return collect($indicator)->only('project', 'title', 'baseline_year', 'baseline_value', 'target_value', 'dimensions', 'periods');
        });
        return $data;
    }

}
