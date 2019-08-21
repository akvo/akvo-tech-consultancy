<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Collection;
use Excel;
use App\Database as DB;
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

    public function visualization(Request $request)
    {
        ResponseCache::clear();
        return view('visualization');
    }

    public function demo(Request $request)
    {
        ResponseCache::clear();
        return view('demo');
    }

    public function timeline(Request $request)
    {
        ResponseCache::clear();
        return view('timeline');
    }

    public function download(Request $request, DB $db)
    {
        $filter= collect($db->downloadExcel($request->lists));
        return $filter;
    }

    public function documentation(Request $request)
    {
        return view('documentation');
    } 
}
