<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PageController extends Controller
{
    public function index(Request $request)
    {
        return view('maps');
    }

    public function test(Request $request)
    {
        return view('test');
    }

    public function database(Request $request)
    {
        return view('database');
    }

    public function stats(Request $request)
    {
        return view('stats-'.$request->page);
    }
}
