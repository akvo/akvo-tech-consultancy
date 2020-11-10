<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Form;
use App\Datapoint;
use App\Partnership;
use App\Question;
use App\User;
use App\QuestionGroup;

class DataTableController extends Controller
{

    public function getCountries(Data $data, Form $forms)
    {
        return $forms->with('questions.data')->get();
    }

    public function getDataPoints(Request $request, Datapoint $datapoints, Partnership $partnerships, Question $questions, QuestionGroup $qgroups)
    {
        $country_cascade = explode('-', config('surveys.country_cascade'))[1];
        if (!isset($request->country)) {
            $country_id = $partnerships->select('id')->where('parent_id', null)->get()->pluck('id');
        }
        if (isset($request->country)) {
            $country_id = [$partnerships->where('name', $request->country)->first()->id];
        }
        $datapoints = $datapoints
            ->where('form_id',$request->form_id)
            ->whereIn('country_id',$country_id)
            ->whereBetween('submission_date', [
                date($request->start),
                date($request->end)
            ])->with('answers')->with('country')->get();
        $datapoints = $datapoints->transform(function($data) {
            return [
                "datapoint_id" => $data->datapoint_id,
                "country" => $data->country->name,
                "submission_date" => $data->submission_date,
                "data" => $data->answers
            ];
        });
        // load question group
        $qgroups = $qgroups->where('form_id', $request->form_id)->get();
        $questions = $questions->where([
                        ['form_id', $request->form_id],
                        ['personal_data', '=', 0]
                    ])->get();
        $total_questions = collect($questions)->count();
        $datapoints = $datapoints->map(function($datapoint) use ($total_questions, $questions, $qgroups, $country_cascade) {
            $ids = collect($datapoint)->get('data')->map(function($data){
                return $data['question_id'];
            });
            $data = $datapoint['data'];
            $datapoint_id = $datapoint['datapoint_id'];
            $collects = collect();
            $collections = $questions->map(function($question) use ($ids, $data, $datapoint_id, $qgroups, $country_cascade, $collects) {
                $id = $question['question_id'];
                $repeat = $qgroups->firstWhere('id', $question['question_group_id'])['repeat'];
                if ($ids->contains($id)){
                    if ($repeat === 0) {
                        $answer = collect($data)->where('question_id', $id)->first();
                        if ($question['type'] == 'date') {
                            $answer['text'] = Str::before($answer['text'], 'T');
                        }
                        $answer['repeat_answers'] = [];
                    }
                    if ($repeat === 1) {
                        $repeats = collect($data)->where('question_id', $id);
                        $temp = collect();
                        $repeats->each(function ($val) use ($temp, $question) {
                            if ($question['type'] == 'date') {
                                $val['text'] = Str::before($val['text'], 'T');
                            }
                            $temp->push($val);
                        });
                        $answer['question_id'] = $id;
                        $answer['datapoint_id'] = $datapoint_id;
                        $answer['text'] = $repeats->first()->text;
                        $answer['value'] = $repeats->first()->value;
                        $answer['options'] = $repeats->first()->options;
                        $answer['repeat_answers'] = $temp;
                    }
                    $answer['repeat'] = $repeat;

                    // check country question
                    if ($question['resource'] !== null && Str::contains($question['resource'], [$country_cascade])) {
                        $splits = explode('|', $answer['text']);
                        foreach ($splits as $key => $split) {
                            $collects->push([
                                "id" => $answer['id'],
                                "question_id" => $answer['question_id'],
                                "datapoint_id" => $answer['datapoint_id'],
                                "text" => $split,
                                "value" => $answer['value'],
                                "options" => $answer['options'],
                                "repeat_index" => $answer['repeat_index'],
                                "repeat_answers" => $answer['repeat_answers'],
                                "repeat" => $answer['repeat'],
                            ]);
                        }
                    } else {
                        $collects->push($answer);
                    }
                    // eol check country question
                    return $answer;
                } else {
                    $collects->push([
                        "id" => null,
                        "question_id" => $id,
                        "datapoint_id" => $datapoint_id,
                        "text" => null,
                        "value" => null,
                        "options" => null,
                        "repeat_index" => 0,
                        "repeat_answers" => [],
                        "repeat" => $repeat,
                    ]);
                };
                return array (
                    "id" => null,
                    "question_id" => $id,
                    "datapoint_id" => $datapoint_id,
                    "text" => null,
                    "value" => null,
                    "options" => null,
                    "repeat_index" => 0,
                    "repeat_answers" => [],
                    "repeat" => $repeat,
                );
            });
            // $datapoint['data'] = $collections;
            $datapoint['data'] = $collects;
            return $datapoint;
        });
        $questionTmp = collect();
        $questions = $questions->map(function($q) use ($qgroups, $country_cascade, $questionTmp) {
            $q['text'] = Str::before($q['text'], ' (');
            $q['text'] = Str::before($q['text'], ':');
            $q['repeat'] = $qgroups->firstWhere('id', $q['question_group_id'])['repeat'];

            // check country question
            if ($q['resource'] !== null && Str::contains($q['resource'], [$country_cascade])) {
                // $splits = explode(' & ', $q['text']);
                $splits = ['Country', 'Partnership'];
                foreach ($splits as $key => $split) {
                    $questionTmp->push([
                        "id" => $q['id'],
                        "question_id" => $q['question_id'],
                        "question_group_id" => $q['question_group_id'],
                        "form_id" => $q['form_id'],
                        "type" => $q['type'],
                        "text" => $split,
                        "personal_data" => $q['personal_data'],
                        "resource" => $q['resource'],
                        "created_at" => $q['created_at'],
                        "updated_at" => $q['updated_at'],
                        "repeat" => $q['repeat']
                    ]);
                }
            } else {
                $questionTmp->push($q);
            }
            // eol check country question
            return $q;
        });
        return [
            'datapoints' => $datapoints->sortByDesc('submission_date')->values(), 
            'questions' => $questionTmp,
            // 'questions' => $questions,
            'qgroups' => $qgroups,
        ];
    }
}
