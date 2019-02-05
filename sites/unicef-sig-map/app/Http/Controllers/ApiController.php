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
					'4'=>'Saperated Toilet for Boys and Girls',
					'2'=>'Shared',
					'1'=>'No Toilet',
				),
				'name' => 'Saperated Toilet',
			),
			'water-source' => array(
				'lookup'=> array(
					'5'=>'Safe to Drink',
					'4'=>'Limited',
					'1'=>'No Service',
				),
				'name' => 'Water Source',
			),
			'water-treatment' => array(
				'lookup'=> array(
					'4'=>'Chlorine',
					'2'=>'Unknown',
					'1'=>'No Services',
				),
				'name' => 'Water Treatment',
			),
			'drinking-water-source' => array(
				'lookup'=> array(
					'5'=>'Basic',
					'2'=>'Limited',
					'1'=>'No Service',
				),
				'name' => 'Schools with Drinking Water Source',
			),
			'limited-mobility-water-access' => array(
				'lookup'=> array(
					'5'=>'Basic',
					'2'=>'Limited',
					'1'=>'No Service',
				),
				'name' => 'Water Access with Limited Mobility',
			),
			'primary-water-source' => array(
				'lookup'=> array(
					'5'=>'Improved',
					'2'=>'Unimproved',
					'1'=>'No Water',
				),
				'name' => 'Primary Drinking Water Source',
			),
			'accesssibility-with-limited-mobility' => array(
				'lookup'=> array(
					'4'=>'Accesible',
					'1'=>'Inaccessible',
				),
				'name' => 'Accessibility with Limited Mobility',
			),
			'hand-washing-property' => array(
				'lookup'=> array(
					'5'=>'Basic',
					'2'=>'Limited',
					'1'=>'No Services',
				),
				'name' => 'Schools with Basic Handwashing',
			),
			'single-sex-sanitation' => array(
				'lookup'=> array(
					'4'=>'Basic',
					'2'=>'Limited',
					'1'=>'No Service',
				),
				'name' => 'Schools with improved sanitation facilities',
			),
			'functional-toilet' => array(
				'lookup'=> array(
					'4'=>'Available',
					'1'=>'Not Available',
				),
				'name' => 'Schools with Functional Toilets',
			),
			'sanitation-improved' => array(
				'lookup'=> array(
					'4'=>'Improved',
					'2'=>'Unimproved',
					'1'=>'No Toilet',
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
                'attribution' => array('id' => 'water-source','name' => 'Water Source','type'=>'str'),
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
                        array('id'=>'water-source', 'name'=>'Water Source', 'type'=>'str'),
                        array('id'=>'water-treatment', 'name'=>'Water Treatment', 'type'=>'str'),
                        array('id'=>'primary-water-source', 'name'=>'Primary Drinking Water Source', 'type'=>'str'),
                        array('id'=>'drinking-water-source', 'name'=>'School with Basic Drinking Source', 'type'=>'str'),
                        array('id'=>'limited-mobility-water-access', 'name'=>'Water Access with Limited Mobility', 'type'=>'str'),
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
                        array('id'=>'functional-toilet', 'name'=>'Schools with Functional Toilets', 'type'=>'str'),
                        array('id'=>'accesssibility-with-limited-mobility', 'name'=>'Accessibity with Limited Mobility', 'type'=>'str'),
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
					'1'=>'No',
					'4'=>'Yes',
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
        return response(array(
            'code'=>$code,
            'message'=>$message), $code);
	}

};
