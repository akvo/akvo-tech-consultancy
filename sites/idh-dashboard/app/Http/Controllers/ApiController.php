<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Akvo\Models\Survey;

class ApiController extends Controller
{

    public function index(Survey $survey)
    {
        return $survey->all();

    }
}
