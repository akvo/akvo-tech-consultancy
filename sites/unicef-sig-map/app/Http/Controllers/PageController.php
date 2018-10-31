<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use ResponseCache;

class PageController extends Controller
{
    public function index(Request $request)
    {
        ResponseCache::clear();
        return view('maps');
    }

    public function test(Request $request)
    {
        return view('test');
    }

    public function database(Request $request)
    {
        ResponseCache::clear();
        return view('database');
    }

    public function stats(Request $request)
    {
        ResponseCache::clear();
        return view('stats-'.$request->page);
    }
}
