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

    public function getSchoolType(Request $request, DB $db)
    {
        return [
            "Primary School",
            "Community High School",
            "Early Childhood Education Center",
            "National Secondary School",
            "Provincial Secondary School",
            "Other",
        ];
    }

    public function getProvinces(Request $request, DB $db)
    {
        return [
          "Central",
          "Choiseul",
          "Guadalcanal",
          "Honiara",
          "Isabel",
          "Makira",
          "Malaita",
          "Rennell and Bellona",
          "Temotu",
          "Western"
        ];
        if (Cache::has('province-list')) {
            $data = Cache::get('province-list');
            return $data;
        }
        $data = $db->provinces();
        $data = collect($data)->map(function($b){
            return $b->EX;
        });
        Cache::put('province-list', $data, 60);
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
				'name' => 'Type of Toilet',
			),
			'water-source' => array(
				'lookup'=> array(
					'1'=>'No Water',
					'4'=>'Has Water',
					'5'=>'Safe to Drink',
				),
				'name' => 'Water SOurce',
			),
            'neutral' => array(
                'lookup'=>array(
                    '1'=>'No Filter'
                ),
                'name' => 'No Filter'
            )
        );
        $complete = ['Wash Club', 'Washing Facilities', 'Annual Grant', 'Community Support', 'Cleaning Schedule', 'Teacher Training or Workshop'];
        $properties = $this->getCompleteFeatures($properties, $complete);
        $data = array(
            'type' => 'FeatureCollection',
            'features' => $features,
            'properties' => array(
                'fields' => $properties,
                'attribution' => array('id' => 'toilet-type','name' => 'Toilet Type','type'=>'str'),
                'attributes' => [array('id'=>'school-info-group','name' => 'School Information', 'collection' => [ 
                        array('id'=>'students_total', 'name'=>'Number of Students', 'type'=>'num'),
                        array('id'=>'students_boy', 'name'=>'Number of Boy Students', 'type'=>'num'),
                        array('id'=>'students_girl', 'name'=>'Number of Girl Students', 'type'=>'num'),
                        array('id'=>'teacher_total', 'name'=>'Number of Teacher', 'type'=>'num'),
                        array('id'=>'teacher_male', 'name'=>'Number of Male Teacher', 'type'=>'num'),
                        array('id'=>'teacher_female', 'name'=>'Number of Female Teacher', 'type'=>'num')
                    ]),
                    array('id'=>'water-supply-group','name' => 'Water Supply', 'collection' => [
                        array('id'=>'water-source', 'name'=>'Water Source', 'type'=>'str'),
                    ]),
                    array('id'=>'hygiene-group','name' => 'Hygiene', 'collection' => [
                        array('id'=>'wash-club', 'name'=>'Wash Club', 'type'=>'str'),
                    ]),
                    array('id'=>'sanitation-group','name' => 'Sanitation', 'collection' => [
                        array('id'=>'toilet-type', 'name'=>'Type of Toilet', 'type'=>'str'),
                        array('id'=>'toilet_total', 'name'=>'Number of Toilets', 'type'=>'num'),
                        array('id'=>'toilet_girl', 'name'=>'Toilets for Girl', 'type'=>'num'),
                        array('id'=>'toilet_boy', 'name'=>'Toilets for Boy', 'type'=>'num'),
                        array('id'=>'toilet_ratio', 'name'=>'Toilet Ratio', 'type'=>'num'),
                        array('id'=>'toilet_girl_ratio', 'name'=>'Toilet Girl Ratio', 'type'=>'num'),
                        array('id'=>'toilet_boy_ratio', 'name'=>'Toilet Boy Ratio', 'type'=>'num'),
                    ]),
                    array('id'=>'management-group','name' => 'School Management', 'collection' => [
                        array('id'=>'wash-club', 'name'=>'Wash Club', 'type'=>'str'),
                        array('id'=>'cleaning-schedule', 'name'=>'Cleaning Schedule', 'type'=>'str'),
                        array('id'=>'annual-grant', 'name'=>'Annual Grant', 'type'=>'str'),
                        array('id'=>'community-support', 'name'=>'Community Support', 'type'=>'str'),
                        array('id'=>'teacher-training-or-workshop', 'name'=>'Teacher Training or Workshop', 'type'=>'str'),
                    ]),
                ]
            )
        );
        return $data;
    }
    private function getCompleteFeatures($data, $arr)
    {
        $data = collect($data);
        collect($arr)->each(function($val) use ($data) {
            $key = strtolower($val);
            $key = str_replace(' ','-',$key);
            return $data[$key] = array(
				'lookup'=> array(
					'1'=>'No',
					'4'=>'Yes',
				),
				'name' => $val
            );
        }); 
        return $data;
    }
};
