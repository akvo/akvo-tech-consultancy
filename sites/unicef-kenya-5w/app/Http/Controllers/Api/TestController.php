<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Str;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Option;
use App\Question;
use Illuminate\Database\Eloquent\Builder;

class TestController extends Controller
{
    public function getTest()
    {
        $formInstances = new \App\FormInstance ();
        $results = $formInstances->with(['answers' => function ($query) {
           $query->whereIn('question_id', [286410925, 298100987]); 
           $query->with('question');
        }],)->get();

        return $results;
    }
}
