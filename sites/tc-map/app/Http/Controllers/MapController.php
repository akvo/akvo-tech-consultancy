<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\DataSource as DS;

class MapController extends Controller
{
    public function getSources(Request $request, DS $ds)
    {
        $data = $ds->select('id', 'source')->get();
        return $data;
    }

    public function getData(Request $request, DS $ds)
    {
        $data = $ds->where('id',$request->source)->first();
        return $data;
    }

    public function getConfig(Request $request, DS $ds)
    {
        $data = $ds->select('config', 'source', 'id')
                   ->where('id',$request->source)
                   ->first();

        return $data->config;
    }
}
