<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function __construct()
    {
        $this->collection = collect();
    }

    public function download(Request $request)
    {
        // return $request->input('images');
        return view('report', ['images' => $request->input('images')]);
    }
}
