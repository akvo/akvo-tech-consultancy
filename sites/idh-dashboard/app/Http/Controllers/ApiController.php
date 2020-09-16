<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Akvo\Models\Datapoint;
use Akvo\Models\Survey;
use Akvo\Models\Variable;

class ApiController extends Controller
{

    public function index(Survey $surveys, Variable $variables)
    {
        return $variables->withCount('questions')->get();
    }
}
