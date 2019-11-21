<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Collection;
use Illuminate\Http\Request;
use App\Libraries\Akvo;
use App\Libraries\Helpers;
use App\Question;
use App\Data;

class ChartController extends Controller
{
    public function questionList(Request $request, Question $questions)
    {
        $questions = $questions->whereIn('type', ['NUMBER','OPTION'])->get(); 
        return $questions;
        $questions = collect($questions)->map(function($question) {
            $type  = $question->type();
            $chart_type = "bar";
            if ($type === "OPTION") {
                $chart_type = "bar";
            }
            $question["chart_type"] = $chart_type;
        });
        return $questions->groupBy('form_id');
    }

    public function chartsById(Request $request, Question $questions)
    {
        $qid = $request->question_id;
        return $questions->where('question_id', $qid)->with('data')->get();
    }

}
