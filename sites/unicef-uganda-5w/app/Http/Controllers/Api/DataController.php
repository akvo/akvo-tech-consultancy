<?php

namespace App\Http\Controllers\Api;

use App\Http\Utilities\HttpResponse;
use Grimzy\LaravelMysqlSpatial\Types\Point;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\QuestionGroup;
use App\Question;
use App\Cascade;
use App\Option;
use App\DataPoint;
use App\Answer;

class DataController extends Controller
{
    public function __construct(
        HttpResponse $responses,
        QuestionGroup $questionGroups,
        Question $questions,
        Cascade $cascades,
        Option $options,
        DataPoint $dataPoints,
        Answer $answers
    )
    {
        $this->res = $responses;
        $this->error = [
            'GFE' => $this->res->error(500),
            'UAR' => $this->res->error(403),
            'NF' => $this->res->error(404),
        ]; 
        $this->qGroups = $questionGroups;
        $this->questions = $questions;
        $this->cascades = $cascades;
        $this->options = $options;
        $this->dataPoints = $dataPoints;
        $this->answers = $answers;
    }

    public function index() 
    {
        $results = $this->qGroups->with(
            ['questions' => function($query) {
                $query->with('answers')->whereHas('answers');
            }]
        )->get();
        return $results; 
    }

    public function getCascades()
    {
        $cascades = $this->questions
                        ->whereHas('cascade')
                        ->with('cascade.childrens.childrens')
                        ->get();

        $results = $cascades->map(function ($cascade) {
            $cascade['cascades'] = $cascade['cascade']['childrens'];
            return collect($cascade)->forget('cascade');
        });

        return $results;
    }

    public function getOptions()
    {
        $results = $this->questions
                        ->whereHas('options')
                        ->with('options')
                        ->get();
       return $results; 
    }

    public function getDataPoints()
    {
        $dataPoints = $this->dataPoints->all();
        $results = $dataPoints->map(function ($dataPoint) {
           $lat = $dataPoint->position->getLat(); 
           $lng = $dataPoint->position->getLng();
           $dataPoint['coordinate'] = [$lat, $lng];
           return collect($dataPoint)->forget('position');
        });

        return $results; 
    }

    public function getCoordinations(Request $requests)
    {
        $optionId = $requests->option_id;
        $results = $this->options
                        ->where('id', $optionId)
                        ->whereHas('answers')
                        ->with('answers')
                        ->get();

            return $this->res->noContent('No data'); 

        return $results;
    }
}
