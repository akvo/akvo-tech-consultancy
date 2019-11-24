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
    }

    public function chartsById(Request $request, Question $questions)
    {
        $qid = $request->question_id;
        return $questions->where('question_id', $qid)->with('data')->get();
    }

}
