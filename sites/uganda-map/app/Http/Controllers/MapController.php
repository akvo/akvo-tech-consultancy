<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\DataSource as DS;
use Storage;

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
        // compress response size
        return  $this->compress($data);
        // $decodedData = base64_decode($data->data);
        // return $foo = utf8_decode($decodedData);
        // $data->data = json_decode(stripslashes($decodedData), true);
        // return var_dump(json_last_error());
        // ob_start('ob_gzhandler'); // compress
        // return $data;
    }

    public function getConfig(Request $request, DS $ds)
    {
        $data = $ds->select('config', 'source', 'id', 'js', 'css')
                   ->where('id',$request->source)
                   ->first();

        $config = json_decode($data->config, true);
        $append["js"] = $data->js;
        $append["css"] = $data->css;
        return array_merge($config, $append);
    }

    public function getGeoShape(Request $request)
    {
        // change location into assets, look coding on si wins for the example
        $json = Storage::disk('local')->get('json/'.$request->file);
        return $this->compress($json);
    }

    private function compress($data)
    {
        return response(gzencode($data, 9))->withHeaders([
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods'=> 'GET',
            'Content-type' => 'application/json; charset=utf-8',
            'Content-Encoding' => 'gzip'
        ]);
    }
}
