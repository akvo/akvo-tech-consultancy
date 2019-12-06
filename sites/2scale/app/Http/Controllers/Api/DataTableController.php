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
        $country_id = $partnerships->where('name', $request->country)->first()->id;
        $datapoints = $datapoints
            ->where('form_id',$request->form_id)
            ->where('country_id',$country_id)
            ->with('answers')
            ->with('country')
            ->get();
        $datapoints = $datapoints->transform(function($data) {
            return [
                "datapoint_id" => $data->datapoint_id,
                "country" => $data->country->name,
                "submission_date" => $data->submission_date,
                "data" => $data->answers
            ];
        });
        $questions = $questions->where('form_id', $request->form_id)->get();
        return ['datapoints' => $datapoints, 'questions' => $questions];
    }
}
