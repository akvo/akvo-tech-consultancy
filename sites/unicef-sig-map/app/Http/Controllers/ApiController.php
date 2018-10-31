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
        $ds = $this->mutateColumns($data, $request);
        return $ds;
    } 

    public function searchData(Request $request, DB $db)
    {
        return $db->search($request->q);
    }

    private function mutateColumns($array, $request)
    {
        $params = $this->getParams($request);
        $params = collect(json_decode($params))->flip();
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
            ->filterColumn('N', function($query, $keyword) {
                $query
                    ->whereRaw("L like ?", ["%{$keyword}%"])
                    ->orWhereRaw("L like ?", ["%{$keyword}%"]);
            })->addColumn('t_students', function($data) {
                return ((int) $data->s_girls + (int) $data->s_boys);
            })->addColumn('t_toilets', function($data) {
                return ((int) $data->t_girls + (int) $data->t_boys + (int) $data->t_sap);
            })->addColumn('bg_toilet', function($data) {
                if ($data->s_toilet === "Yes"){
                    $tboys ='<i class="fa fa-male"></i> '.(int) $data->t_boys;
                    $tgirls ='<i class="fa fa-female"></i> '.(int) $data->t_girls;
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

    public function getProvinces(Request $request, DB $db)
    {
        $data = $db->provinces();
        $data = collect($data)->map(function($b){
            return $b->EX;
        });
        return $data;
    }
    /*
     * Indicator Test
     */
    public function getIndicators(Request $request, DB $db)
    {
        $data = $db->indicators();
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
			'toilet-type' => array(
				'lookup'=> array(
					'1'=>'No Toilet',
					'4'=>'Private',
					'2'=>'Shared',
				),
				'name' => 'Toilet Type',
			),
			'water-source' => array(
				'lookup'=> array(
					'1'=>'No Water',
					'4'=>'Has Water',
					'5'=>'Safe to Drink',
				),
				'name' => 'Water Source',
			),
			'wash-club' => array(
				'lookup'=> array(
					'1'=>'No',
					'4'=>'Yes',
				),
				'name' => 'Wash Club',
			),
            'neutral' => array(
                'lookup'=>array(
                    '1'=>'No Filter'
                ),
                'name' => 'No Filter'
            )
        );
        $data = array(
            'type' => 'FeatureCollection',
            'features' => $features,
            'properties' => array(
                'fields' => $properties,
                'attribution' => array('id' => 'toilet-type','name' => 'Toilet Type','type'=>'str'),
                'attributes' => [
                    array('id'=>'toilet-type', 'name'=>'Toilet Type', 'type'=>'str'),
                    array('id'=>'water-source', 'name'=>'Water Source', 'type'=>'str'),
                    array('id'=>'wash-club', 'name'=>'Wash Club', 'type'=>'str'),
                    array('id'=>'students_boy', 'name'=>'Students Boys', 'type'=>'num'),
                    array('id'=>'students_girl', 'name'=>'Students Girl', 'type'=>'num'),
                    array('id'=>'toilet_total', 'name'=>'Total Toilet', 'type'=>'num'),
                    array('id'=>'toilet_girl', 'name'=>'Total Girls Toilet', 'type'=>'num'),
                    array('id'=>'toilet_boy', 'name'=>'Total Boys Toilet', 'type'=>'num'),
                    array('id'=>'toilet_ratio', 'name'=>'Toilet Ratio', 'type'=>'num'),
                    array('id'=>'toilet_girl_ratio', 'name'=>'Toilet Girl Ratio', 'type'=>'num'),
                    array('id'=>'toilet_boy_ratio', 'name'=>'Toilet Boy Ratio', 'type'=>'num'),
                    array('id'=>'teacher_female', 'name'=>'Teacher Female', 'type'=>'num')
                ],
            )
        );
        return $data;
    }
}
