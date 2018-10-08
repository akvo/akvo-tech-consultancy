<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;
use App\Database as DB;
use DataTables;

class ApiController extends Controller
{

    public function getParams(Request $request)
    {
        $spath = asset('storage/config.json');
        $keys = file_get_contents($spath, true); 
        return $keys;
    }

    public function getLocation(Request $request, DB $db)
    {
        return $db->locations();
    }

    public function getDetail(Request $request, DB $db)
    {
        $data = $db->details($request->id);
        $ds = $this->mutateColumns(json_decode($data), $request);
        return $ds;
    } 

    public function searchData(Request $request, DB $db)
    {
        return $db->search($request->q);
    }

    private function mutateColumns($array, $request)
    {
        $params = $this->getParams($request);
        $params = collect(json_decode($params));
        $params = $params->transform(function($data) use ($array){
            $str = (string) $data;
            return $array->$str;
        });
        return $params;
    }

    public function getDataTables(Request $request, DB $db)
    {
        $db = $db->datatable();
        return DataTables::eloquent($db)
            ->filterColumn('23430921', function($query, $keyword) {
                $query
                    ->whereRaw("22480946 like ?", ["%{$keyword}%"])
                    ->orWhereRaw("28390923 like ?", ["%{$keyword}%"])
                ;
            })->addColumn('t_students', function($data) {
                return ((int) $data->s_girls + (int) $data->s_boys);
            })->addColumn('bg_toilet', function($data) {
                if ($data->s_toilet === "Yes"){
                    $tboys ='<i class="fa fa-male"></i> '.$data->t_boys;
                    $tgirls ='<i class="fa fa-female"></i> '.$data->t_girls;
					return $tboys.' '.$tgirls;
                };
                return '<i style="color:red" class="fa fa-exclamation-circle"></i>';
            })->rawColumns(['bg_toilet'])
                ->make(true);
    }

    public function getGeoJson(Request $request, DB $db)
    {
        if (Cache::has('all-geojson')) {
            $data = Cache::get('all-geojson');
            return $data;
        }
        $features = $db->maps(); 
        $data = $this->getFeatures($features);
        Cache::put('all-geojson', $data, 60);
        return $data;
    }

    private function getFeatures($features)
    {
        $properties = array(
			'school_name' => array(
				'name'=>"School Name"
			),
			'school_id' => array(
				'name'=>"ID"
			),
			'water-source' => array(
				'lookup'=> array(
					'1'=>'No Water',
					'4'=>'Has Water',
					'5'=>'Safe to Drink',
				),
				'name' => 'Water Source'
			),
			'toilet-type' => array(
				'lookup'=> array(
					'1'=>'No Toilet',
					'4'=>'Private',
					'5'=>'Shared',
				),
				'name' => 'Toilets'
			),
        );
        $data = array(
            'type' => 'FeatureCollection',
            'features' => $features,
            'properties' => array(
                'fields' => $properties,
                'attribution' => array(
                    'id' => 'water-source',
                    'name' => 'Water Source'
                ),
                'attributes' => [
                    array('id'=>'toilet-type', 'name'=>'Toilet Type'),
                    array('id'=>'water-source', 'name'=>'Water Source')
                ],
                'description' => 'Toilet Description'
            )
        );
        return $data;
    }
}
