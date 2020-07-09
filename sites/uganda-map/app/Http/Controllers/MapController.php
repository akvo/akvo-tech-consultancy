<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\DataSource as DS;

class MapController extends Controller
{
    public function getSources(Request $request, DS $ds)
    {
        $data = $ds->select('id', 'parent_id', 'type', 'source')
                    ->where('type', 'survey')
                    ->with('childrens.childrens')
                    ->get();
        return $data;
    }

    public function getData(Request $request, DS $ds)
    {
        $data = $ds->where('id',$request->source)->first();
        // $decodedData = base64_decode($data->data);
        // return $foo = utf8_decode($decodedData);
        // $data->data = json_decode(stripslashes($decodedData), true);
        // return var_dump(json_last_error());
        return $data;
    }

    public function getConfig(Request $request, DS $ds)
    {
        $data = $ds->select('config', 'source', 'id', 'js')
                   ->where('id',$request->source)
                   ->first();

        $config = json_decode($data->config, true);
        $js["js"] = $data->js;
        return array_merge($config, $js);
    }
}
