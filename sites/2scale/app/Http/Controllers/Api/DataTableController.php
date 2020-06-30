<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Collection;
use Illuminate\Http\Request;
use App\Form;
use App\Datapoint;
use App\Partnership;
use App\Question;
use App\User;

class DataTableController extends Controller
{

    public function getCountries(Data $data, Form $forms)
    {
        return $forms->with('questions.data')->get();
    }

    public function getDataPoints(Request $request, Datapoint $datapoints, Partnership $partnerships, Question $questions)
    {
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
        $questions = $questions->where([
                        ['form_id', $request->form_id],
                        ['personal_data', '=', 0]
                    ])->get();
        $total_questions = collect($questions)->count();
        $datapoints = $datapoints->map(function($datapoint) use ($total_questions, $questions) {
            $ids = collect($datapoint)->get('data')->map(function($data){
                return $data['question_id'];
            });
            $data = $datapoint['data'];
            $datapoint_id = $datapoint['datapoint_id'];
            $collections = $questions->map(function($question) use ($ids, $data, $datapoint_id) {
                $id = $question['question_id'];
                if ($ids->contains($id)){
                    return collect($data)->where('question_id', $id)->first();
                };
                return array (
                    "id" => null,
                    "question_id" => $id,
                    "datapoint_id" => $datapoint_id,
                    "text" => null,
                    "value" => null,
                    "options" => null,
                );
            });
            $datapoint['data'] = $collections;
            return $datapoint;
        });
        return ['datapoints' => $datapoints, 'questions' => $questions];
    }
}
