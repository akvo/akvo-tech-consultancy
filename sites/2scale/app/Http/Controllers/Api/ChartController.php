<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Libraries\Akvo;
use App\Libraries\Helpers;
use App\Question;
use App\Data;

class ChartController extends Controller
{

    public function questionId(Request $request, Question $questions)
    {
        // $identity = $request->id;
        return $questions->with('data')->get();
    }

}
