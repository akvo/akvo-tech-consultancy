<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Collection;
use Illuminate\Http\Request;
use App\Form;
use App\Data;
use App\Question;
use App\User;

class TestController extends Controller
{

    public function getCountries(Data $data, Form $forms)
    {
        return $forms->with('questions.data')->get();
    }

    public function getDataPoints(Request $request, Form $form, Data $data, Question $questions)
    {
        $questions = $questions->where('form_id', $request->form_id)->get();
        $datapoints = $data->select('datapoint_id', 'country', 'submission_date')
                           ->where('form_id',$request->form_id)
                           ->groupBy('datapoint_id')->get();
        $datapoitns = collect($datapoints)->map(function($datapoint) use ($data, $questions, $request) {
            $points = $data->select('answer', 'question_id')
                          ->where('form_id', $request->form_id)
                          ->where('datapoint_id', $datapoint->datapoint_id)
                          ->with('question')
                          ->get();
            forEach($points as $point) {
                $point->order = $point->question->id;
                $point = $point->makeHidden('question');
            }
            $points = collect($points)->sortBy('order')->values()->toArray();
            $datapoint->data = $points;
            return $datapoint;
        });
        return ['datapoints' => $datapoints, 'questions' => $questions];
    }
}
