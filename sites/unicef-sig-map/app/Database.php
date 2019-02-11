<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use DB;

class Database extends Model
{
    protected $hidden = ['index'];

    public function downloadExcel($arr)
    {
        return $this->whereIn('A', $arr)->get();
    } 

    public function getRegistrationAttribute()
    {
        return (int) $this->attributes['A'];
    }

    public function maps()
    {
        $db = collect($this->all(
            'EU as latitude',
            'EV as longitude',
			'A as identifier',
            'EX as province',
            'L as school_name', 
            'N as school_type',
            'O as school_type_other',
            'S as ts_girl',
            'T as ts_boy',
            DB::raw('(S + T) as students_total'),
            'U as tt_male',
            'V as tt_female',
            DB::raw('(U + V) as teacher_total'),
            'CU as wash_club',
            'CF as handwashing_facilities',
            'DU as annual_grant', 
            'DY as community_support', 
            'DD as cleaning_schedule', 
            'DD as training', 
            'BH as toilet_together',
            'BJ as toilet_girl',
            'BL as toilet_boy',
            'BG as separated', 
            'BU as toilet_location', 
            'AV as has_toilets',
            'AN as water_inspection',
            'AJ as safe_to_drink',
            'DW as government_funds',
            'EY as drink_water',
            'EZ as primary_water_source',
            'FA as funct_toilet',
            'FB as single_sex_san',
            'FC as sanitation_impr',
            'FE as handwashing_prop',
            'CL as wash_soap',
            'CR as wash_girl'
        ))->map(function($data) {
			$toilet = '1';
			if ($data->has_toilets === 'Yes') {
				$toilet = '2';
			}
			if ($data->separated === 'Yes') {
				$toilet = '4';
			}
            $handwashing_prop = '2';
			if ($data->handwashing_prop === 'Limited') {
				$handwashing_prop = '6';
			}
			if ($data->handwashing_prop === 'Basic') {
				$handwashing_prop = '7';
			}
            $sanitation_improved = '1';
			if ($data->sanitation_impr === 'Unimproved') {
				$sanitation_improved = '2';
			}
			if ($data->sanitation_impr === 'Improved') {
				$sanitation_improved = '6';
			}
            $primary_water_source = '1';
			if ($data->primary_water_source === 'Unimproved') {
				$primary_water_source = '6';
			}
			if ($data->primary_water_source === 'Improved') {
				$primary_water_source = '8';
			}
            $single_sex_sanitation = '4';
			if ($data->single_sex_san === 'No Services') {
				$single_sex_sanitation = '2';
			}
			if ($data->single_sex_san === 'Limited') {
				$single_sex_sanitation = '1';
			}
            $drink_water = '1';
			if ($data->drink_water === 'Limited') {
				$drink_water = '2';
			}
			if ($data->drink_water === 'Basic') {
				$drink_water = '5';
			}
            $data->wash_soap = ($data->wash_soap !== null ? "4":"1");
            $data->wash_club = ($data->wash_club === "Yes" ? "4":"1");
            $data->funct_toilet = ($data->funct_toilet <= 0 ? "4":"1");
            $data->water_inspection = ($data->water_inspection === "Yes" ? "4":"1");
            $data->handwashing_facilities = ($data->handwashing_facilities === "Yes" ? "4":"1");
            $data->community_support = ($data->community_support === "Yes" ? "4":"1");
            $data->annual_grant = ($data->annual_grant === "Yes" ? "4":"1");
            $data->training = ($data->training === "Yes" ? "4":"1");
            $data->cleaning_schedule = ($data->cleaning_schedule === "Yes" ? "4":"1");
            $data->wash_girl = ($data->wash_girl === "Yes" ? "4":"1");
            $data->toilet_location = ($data->toilet_location = null ? "No Toilet" : explode(" ",$data->toilet_location)[0]);
            if ($data->school_type === null){
                $data->school_type = "Other";
            }
            $data->teacher_ratio = round($data->students_total / $data->teacher_total, 2); 
            $data->toilet_total = (int) $data->toilet_together + (int) + $data->toilet_girl + (int) $data->toilet_boy;
            $data->toilet_ratio = 0; 
            $data->toilet_girl_ratio = 0;
            $data->toilet_boy_ratio = 0;
            if ($data->toilet_total != 0){
                $data->toilet_ratio = round((int) $data->students_total / (int) $data->toilet_total, 2);
                if($data->toilet_girl !=0 && $data->ts_girl !=0){
                    $data->toilet_girl_ratio = round($data->ts_girl / $data->toilet_girl, 2);
                }
                if($data->toilet_boy != 0 && $data->ts_boy !=0){
                    $data->toilet_boy_ratio = round($data->ts_boy / $data->toilet_boy, 2);
                }
            }
			$results = array(
                'geometry' => array(
                    'type' => 'Point',
                    'coordinates' => array((float)$data->longitude, (float)$data->latitude),
                ),
                'type' => 'Feature',
                'properties' => array(
                    'school-type' => $data->school_type,
                    'province' => $data->province,
                    'school_name' => $data->school_name,
                    'students_total' => (int) $data->students_total, 
                    'students_boy' => (int) $data->ts_boy,
                    'students_girl' => (int) $data->ts_girl,
                    'teacher_total' => (int) $data->teacher_total,
                    'teacher_male' => (int) $data->tt_male,
                    'teacher_female' => (int) $data->tt_female,
                    'teacher_ratio' => (int) $data->teacher_ratio, 
                    'toilet_girl' => (int) $data->toilet_girl, 
                    'toilet_boy' => (int) $data->toilet_boy, 
                    'toilet_total' => (int) $data->toilet_total, 
                    'toilet_ratio' => (int) $data->toilet_ratio, 
                    'toilet_girl_ratio' => (int) $data->toilet_girl_ratio, 
                    'toilet_boy_ratio' => (int) $data->toilet_boy_ratio, 
                    'toilet_toilet_location' => $data->toilet_location, 
                    'school_id' => $data->identifier,
                    'government_funds' => (int) $data->government_funds,
                    'toilet-type' => $toilet,
                    'water-inspection' => $data->water_inspection,
                    'drinking-water-source' => $drink_water,
                    'primary-water-source' => $primary_water_source,
                    'wash-club' => $data->wash_club,
                    'handwashing-facilities-are-available' => $data->handwashing_facilities,
                    'annual-grant' => $data->annual_grant,
                    'community-support' => $data->community_support,
                    'cleaning-schedule' => $data->cleaning_schedule,
                    'teacher-training-or-workshop' => $data->training,
                    'hand-washing-property' => $handwashing_prop,
                    'private-washing-facilities-for-girl' => $data->wash_girl,
                    'soap-or-water-availability' => $data->wash_soap,
                    'functional-toilet' => $data->funct_toilet,
                    'single-sex-sanitation' => $single_sex_sanitation,
                    'sanitation-improved' => $sanitation_improved,
                )
			);
			return $results;
		});
		return $db->filter()->values();
    }

    public function locations()
    {
        $db = collect($this->all('longitude','latitude','identifier', 'display_name'))->map(function($data) {
            $results = array( 
                'latlng' => [(float) $data->latitude, (float) $data->longitude],
                'id' => $data->identifier,
                'name' => $data->display_name
            );
            return $results;
        });
        return $db;
    }

    public function provinces()
    {
        $db = $this->select('EX')
            ->groupby('EX')
            ->get();
        return $db;
    }


    public function search($q)
    {
        $db = $this->select('L as school','N as school_type', 'O as school_type_other' , 'A as identifier', 'EU as latitude', 'EV as longitude', 'EX as province')
            ->where('L', 'LIKE', '%'.$q.'%')
            ->orWhere('A', 'LIKE', '%'.$q.'%')
            ->take(5)->get();
        return $db;
    }

    public function details($id)
    {
        $db = $this->where('A', $id)->first();
        return $db;
    }

    public function datatable()
    {
        return $this->select(
            'EX as province',
            'N as school_type',
            'O as school_type_other',
            DB::raw('(U + V) as total_teacher'),
            'Y as water_source',
            'CU as wash_club',
            'CF as washing_facilities',
            'DY as community_support', 
            'DD as cleaning_schedule', 
            'DD as training', 
            'AV as has_toilets',
            'AJ as safe_to_drink',
            'DW as annual_grant',
            'P', 
            'R', 
            'L', 
            'A',
            DB::raw('(S + T) as total_students'),
            DB::raw('(BG + BJ + BL) as total_toilet'),
            'S as s_girls',
            'T as s_boys',
            'BH as t_sap',
            'BG as s_toilet',
            'BJ as t_girls',
            'BL as t_boys'
        );
    }

    public function toilets()
    {
        $data = collect($this->all(
            'BH as shared',
            'BJ as t_girls',
            'BL as t_boys'
        ))->map(function($data){
            $data->t_toilets = (int) $data->shared + (int) $data->t_girls + (int) $data->t_boys;
            return $data;
        });
        return $data;
        
    }

    public function countGroup($name)
    {
        $data = $this->select(
            $name, 
            'EX as PV',
            DB::raw('count('.$name.') as TT')
        )
        ->groupBy($name, 'PV')
        ->get();
        return $data;
    }

    public function indicators($name)
    {
        $db = $this->select($name)
            ->groupby($name)
            ->get();
        return collect($db)->map(function($a) use ($name) {
            return $a[$name];
        });
    }
}
