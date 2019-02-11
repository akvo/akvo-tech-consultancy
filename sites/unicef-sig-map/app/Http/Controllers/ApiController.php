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
        $spath = asset('/config.json');
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
            })->addColumn('t_teacher', function($data) {
                return ((int) $data->teacher_male + (int) $data->teacher_female);
            })->addColumn('registration', function($data) {
                return (int) $data->P;
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
        $features = $db->maps(); 
        $data = $this->getFeatures($features, 'full');
        return $data;
    }

    public function transGeoJson(Request $request, DB $db)
    {
        $features = $db->maps(); 
        $collection = collect($features)->map(function($x){
            $y = collect([$x['geometry']['coordinates']]);
            $v = $y->merge(collect($x['properties'])->values());
            return $v->all();
        });
        return $collection;
    }
    public function getGeoFeatures(Request $request, DB $db)
    {
        if (Cache::has('all-geo-features')) {
            $data = Cache::get('all-geo-features');
            return $data;
        }
        $features = $db->maps(); 
        $data = $this->getFeatures($features, 'min');
        Cache::put('all-geo-features', $data, 60);
        return $data;
    }

    public function getGeoRson(Request $request, DB $db)
    {
        if (Cache::has('all-georson')) {
            $data = Cache::get('all-georson');
            return $data;
        }
        $spath = asset('/rgeojson.json');
        $data = file_get_contents($spath, true); 
        Cache::put('all-georson', $data, 60);
        return $data;
    }

    public function getCountable(Request $request)
    {
        if (Cache::has('all-countable')) {
            $data = Cache::get('all-countable');
            return $data;
        }
        $spath = asset('/all-countable.json');
        $data = file_get_contents($spath, true); 
        Cache::put('all-countable', $data, 60);
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

	public function getCountAllIndicators(Request $request, DB $db)
	{
        $variables = collect(['Y','EY','EZ','AN','AV','FB','FC','FD','CF','CL','CR','FE']);
        $results = collect();
        $variables->each(function($x) use ($db, $results) {
            $results[$x] = $this->transformChart($db, $x);
        });
        return $results;
	}

    private function transformChart($db, $name)
    {
        $province = collect([
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
        ]);
        $collection = $db->countGroup($name);
        $answer = $db->indicators($name);
        $collection = $collection->mapToGroups(function ($item, $key) use ($name) {
            return [$item['PV'] => array($item[$name] => (int) $item['TT'])];
        });
		$sum_province = collect();
        $res = collect();
        $answer->each(function($a, $i) use ($province, $res, $collection) {
                $b = collect();
                collect($province)->each(function($p, $g) use ($i,$a,$b,$collection) {
                $x = $collection[$p];
                    if(isset($x[$i][$a])){
                        $b->push($x[$i][$a]);
                    }else{
                        $b->push(0);
                    }
                });
				$res->push([
					'name'=>$a,
					'stack'=>'2018',
					'data'=>$b,
					'type'=>'bar'
				]);
        });
		$db = $res->transform(function($r){
			$med = collect();
			$med->push($r['data']);
			$med->push(collect($r['data'])->avg());
			$r['data'] = $med->flatten(1);
			return $r;
		});
        $spath = asset('/config.json');
        $keys = json_decode(file_get_contents($spath, true), true);
        return array(
			'answer' => $answer, 
            'question' => $keys[$name],
            'province' => $province->push(['National'])->flatten(),
            'result' => $db
        );
    }

    /*
     * Indicator Test
     */
    private function getFeatures($features, $type)
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
                    '4'=> array(
                        'option' => 'Saperated Toilet for Boys and Girls',
                        'description' => 'As part of acknowledging the vulenrability of girls, segregated toilets form part of the definition for Basic Sanitation',
                    ),
                    '2'=> array(
                        'option' => 'Shared',
                        'description' => 'As part of acknowledging the vulenrability of girls, segregated toilets form part of the definition for Basic Sanitation',
                    ),
                    '1'=> array(
                        'option' => 'No Toilet',
                        'description' => 'As part of acknowledging the vulenrability of girls, segregated toilets form part of the definition for Basic Sanitation',
                    )
				),
				'name' => 'Saperated Toilet',
			),
			'primary-water-source' => array(
				'lookup'=> array(
                    '8'=> array(
                        'option' => 'Improved',
                        'description' => 'Improved drinking water sources are those that have the potential to deliver safe water by nature of their design and construction, and include: piped water, boreholes or tubewells, protected dug wells, protected springs, rainwater, and packaged or delivered water.'
                    ),
                    '6'=> array(
                        'option' => 'Unimproved',
                        'description' => 'Improved drinking water sources are those that have the potential to deliver safe water by nature of their design and construction, and include: piped water, boreholes or tubewells, protected dug wells, protected springs, rainwater, and packaged or delivered water.'
                    ),
                    '1'=> array(
                        'option' => 'No Services',
                        'description' => 'Improved drinking water sources are those that have the potential to deliver safe water by nature of their design and construction, and include: piped water, boreholes or tubewells, protected dug wells, protected springs, rainwater, and packaged or delivered water.'
                    )
				),
				'name' => 'Primary Drinking Water Source',
			),
			'drinking-water-source' => array(
				'lookup'=> array(
                    '5'=> array(
                        'option' => 'Basic',
                        'description' => 'Drinking water from an improved source is available at the school',
                    ),
                    '2'=> array(
                        'option' => 'Limited',
                        'description' => 'There is an improved source (piped, protected well/spring, rainwater, packaged/delivered water), but water not available at time of survey',
                    ),
                    '1'=> array(
                        'option' => 'No Services',
                        'description' => 'No water source or unimproved source (unprotected well/spring, surface water)'
                    )
				),
				'name' => 'Schools with Drinking Basic Water Source',
			),
			'hand-washing-property' => array(
				'lookup'=> array(
                    '7'=> array(
                        'option' => 'Basic',
                        'description' => 'Handwashing facilities, which have water and soap available',
                    ),
                    '6'=> array(
                        'option' => 'Limited',
                        'description' => 'Handwashing facilities with water, but no soap',
                    ),
                    '2'=> array(
                        'option' => 'No Services',
                        'description' => 'No handwashing facilities at the school or handwashing facilities with no water',
                    )
				),
				'name' => 'Schools with Basic Handwashing',
			),
			'single-sex-sanitation' => array(
				'lookup'=> array(
                    '4'=> array(
                        'option' => 'Basic',
                        'description' => 'Improved facilities, which are single-sex and usable at the school',
                    ),
                    '2'=> array(
                        'option' => 'Limited',
                        'description' => 'There are improved facilities (flush/pour-flush toilets, pit latrine with slab, composting toilet), but not single-sex or not usable at time of survey',
                    ),
                    '1'=> array(
                        'option' => 'No Services',
                        'description' => 'No toilets or latrines, or unimproved facilities (pit latrines without a slab or platform, hanging latrines, bucket latrines)',
                    )
				),
				'name' => 'Schools with improved sanitation facilities',
			),
			'functional-toilet' => array(
				'lookup'=> array(
                    '4'=> array(
                        'option' => 'Functional',
                        'description' => 'On the day of the survey the toilet was available and functioning'
                    ),
                    '1'=> array(
                        'option' => 'Non-Functional',
                        'description' => 'On the day of the survey the toilet was unavailable and functioning'
                    )
				),
				'name' => 'Schools with Basic Functional Toilets',
			),
			'sanitation-improved' => array(
				'lookup'=> array(
                    '6'=> array(
                        'option' => 'Improved',
                        'description' => 'Improved sanitation facilities are those designed to hygienically separate excreta from human contact, and include: flush/pour flush to piped sewer system, septic tanks or pit latrines; ventilated improved pit latrines, composting toilets or pit latrines with slabs.'
                    ),
                    '2'=> array(
                        'option' => 'Unimproved',
                        'description' => 'Improved sanitation facilities are those designed to hygienically separate excreta from human contact, and include: flush/pour flush to piped sewer system, septic tanks or pit latrines; ventilated improved pit latrines, composting toilets or pit latrines with slabs.'
                    ),
                    '1'=> array(
                        'option' => 'No Service',
                        'description' => 'Improved sanitation facilities are those designed to hygienically separate excreta from human contact, and include: flush/pour flush to piped sewer system, septic tanks or pit latrines; ventilated improved pit latrines, composting toilets or pit latrines with slabs.'
                    )
				),
				'name' => 'Primary Sanitation Type',
			),
            'neutral' => array(
                'lookup'=>array(
                    '1'=>'No Filter'
                ),
                'name' => 'No Filter'
            )
        );
        $complete = [
            'Wash Club',
            'Handwashing Facilities are Available',
            'Annual Grant',
            'Community Support',
            'Cleaning Schedule',
            'Teacher Training or Workshop',
            'Private Washing Facilities for Girl',
            'Soap or Water Availability',
            'Water Inspection',
        ];
        $properties = $this->getCompleteFeatures($properties, $complete);
        $data = array(
            'type' => 'FeatureCollection',
            'properties' => array(
                'fields' => $properties,
                'attribution' => array('id' => 'primary-water-source','name' => 'Primary Drinking Water Source','type'=>'str'),
                'attributes' => [array('id'=>'school-info-group','name' => 'School Information', 'collection' => [ 
                        array('id'=>'students_total', 'name'=>'Number of Students', 'type'=>'num'),
                        array('id'=>'students_boy', 'name'=>'Number of Boy Students', 'type'=>'num'),
                        array('id'=>'students_girl', 'name'=>'Number of Girl Students', 'type'=>'num'),
                        array('id'=>'teacher_total', 'name'=>'Number of Teacher', 'type'=>'num'),
                        array('id'=>'teacher_male', 'name'=>'Number of Male Teacher', 'type'=>'num'),
                        array('id'=>'teacher_female', 'name'=>'Number of Female Teacher', 'type'=>'num'),
                        array('id'=>'teacher_ratio', 'name'=>'Teacher/Students Ratio', 'type'=>'num')
                    ]),
                    array('id'=>'water-supply-group','name' => 'Water Supply', 'collection' => [
                        array('id'=>'primary-water-source', 'name'=>'Primary Drinking Water Source', 'type'=>'str'),
                        array('id'=>'drinking-water-source', 'name'=>'School with Basic Drinking Source', 'type'=>'str'),
                        array('id'=>'water-inspection', 'name'=>'Availability of water at time of Inspection', 'type'=>'str'),
                    ]),
                    array('id'=>'hygiene-group','name' => 'Hygiene', 'collection' => [
                        array('id'=>'handwashing-facilities-are-available', 'name'=>'Handwashing Facilities are Available', 'type'=>'str'),
                        array('id'=>'hand-washing-property', 'name'=>'Schools with Basic Handwashing', 'type'=>'str'),
                        array('id'=>'soap-or-water-availability', 'name'=>'Handwashing Facilities have Soap and Water Available', 'type'=>'str'),
                        array('id'=>'private-washing-facilities-for-girl', 'name'=>'Private Washing Facilities for Girl', 'type'=>'str'),
                        array('id'=>'wash-club', 'name'=>'Wash Club', 'type'=>'str'),
                    ]),
                    array('id'=>'sanitation-group','name' => 'Sanitation', 'collection' => [
                        array('id'=>'toilet-type', 'name'=>'Separated toilet', 'type'=>'str'),
                        array('id'=>'toilet_total', 'name'=>'Number of Toilets', 'type'=>'num'),
                        array('id'=>'toilet_girl', 'name'=>'Toilets for Girl', 'type'=>'num'),
                        array('id'=>'toilet_boy', 'name'=>'Toilets for Boy', 'type'=>'num'),
                        array('id'=>'toilet_ratio', 'name'=>'Toilet Ratio', 'type'=>'num'),
                        array('id'=>'toilet_girl_ratio', 'name'=>'Toilet Girl Ratio', 'type'=>'num'),
                        array('id'=>'toilet_boy_ratio', 'name'=>'Toilet Boy Ratio', 'type'=>'num'),
                        array('id'=>'functional-toilet', 'name'=>'Schools with Basic Functional Toilets', 'type'=>'str'),
                        array('id'=>'single-sex-sanitation', 'name'=>'Schools with improved sanitation facilities', 'type'=>'str'),
                        array('id'=>'sanitation-improved', 'name'=>'Primary Sanitation Type', 'type'=>'str'),
                    ]),
                    array('id'=>'management-group','name' => 'School Management', 'collection' => [
                        array('id'=>'cleaning-schedule', 'name'=>'Cleaning Schedule', 'type'=>'str'),
                        array('id'=>'annual-grant', 'name'=>'Annual Grant', 'type'=>'str'),
                        array('id'=>'government_funds', 'name'=>'Government Funds', 'type'=>'num'),
                        array('id'=>'community-support', 'name'=>'Community Support', 'type'=>'str'),
                        array('id'=>'teacher-training-or-workshop', 'name'=>'Teacher Training or Workshop', 'type'=>'str'),
                    ]),
                ]
            )
        );
		if ($type === 'full'){
			$data['features'] = $features;
		}else{
			$data['features'] = [];
		};
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
                    '1'=> array(
                        'option'=>'No',
                        'description'=>'Not Available',
                    ),
                    '4'=> array(
                        'option'=>'Yes',
                        'description'=>'Available',
                    ),
				),
				'name' => $val
            );
        }); 
        return $data;
    }


	/*
		Verify Download Function (NOT LOGIN)
	*/
	public function getVerification(Request $request)
	{
        $code = 401;
        $message = 'Wrong Code'; 
		if ($request->security_code === 'wins12345'){
            $code = 200;
            $message = 'Granted';
		}
        $resp = array(
            'code'=>$code,
            'message'=>$message
        );
        return response()->json($resp, $code);
	}

};
