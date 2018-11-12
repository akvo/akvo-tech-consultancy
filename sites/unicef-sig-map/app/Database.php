<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use DB;

class Database extends Model
{
    /*
    public function getTotalStudentsAttribute()
    {
        $total = $this->attributes['28390924'] + $this->attributes['23430922'];
        return $total;
    }
     */

    protected $hidden = ['index'];

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
            'U as tt_male',
            'V as tt_female',
            'Y as water_source',
            'CU as wash_club',
            'CF as washing_facilities',
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
            'AJ as safe_to_drink',
            'DW as government_funds'
        )->whereNotIn(
            'identifier', ['d3es-mqgt-9mmg', 'tf33-p848-vwrk', 'fnd5-549n-tp75']
        ))->map(function($data) {
			$toilet = '1';
			if ($data->has_toilets === 'Yes')
			{
				$toilet = '2';
			}
			if ($data->separated === 'Yes')
			{
				$toilet = '4';
			}
            $water = '1';
			if ($data->water_source === 'Yes')
			{
				$water= '4';
			}
			if ($data->safe_to_drink === 'Yes')
			{
				$water= '5';
			}
            $data->wash_club = ($data->wash_club === "Yes" ? "1":"4");
            $data->washing_facilities = ($data->washing_facilities === "Yes" ? "1":"4");
            $data->community_support = ($data->community_support === "Yes" ? "1":"4");
            $data->annual_grant = ($data->annual_grant === "Yes" ? "1":"4");
            $data->training = ($data->training === "Yes" ? "1":"4");
            $data->cleaning_schedule = ($data->cleaning_schedule === "Yes" ? "1":"4");
            $data->toilet_location = ($data->toilet_location = null ? "No Toilet" : explode(" ",$data->toilet_location)[0]);
            if ($data->school_type === null){
                $data->school_type = "Other";
            }
            $data->total_teacher = $data->tt_female + $data->tt_male;
            $data->total_students = 0;
            $data->total_students = $data->ts_girl + $data->ts_boy;
            $data->teacher_ratio = 0;
            if ($data->total_teacher != null && $data->total_students != null){
                $data->teacher_ratio = round($data->total_students / $data->total_teacher, 2); 
            }
            $data->toilet_total = $data->toilet_girl + $data->toilet_boy + $data->toilet_together;
            $data->toilet_ratio = 0; 
            $data->toilet_girl_ratio = 0;
            $data->toilet_boy_ratio = 0;
            if ($data->toilet_total != null && $data->total_students != null){
                $data->toilet_ratio = round($data->total_students / $data->toilet_total, 2);
                if($data->toilet_girl != null && $data->ts_girl !=null){
                    $data->toilet_girl_ratio = round($data->ts_girl / $data->toilet_girl, 2);
                }
                if($data->toilet_boy != 0 && $data->ts_boy !=null){
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
                    'students_total' => $data->total_students, 
                    'students_boy' => (int) $data->ts_boy,
                    'students_girl' => (int) $data->ts_girl,
                    'teacher_total' => $data->total_teacher,
                    'teacher_male' => (int) $data->tt_male,
                    'teacher_female' => (int) $data->tt_female,
                    'teacher_ratio' => $data->teacher_ratio, 
                    'toilet_girl' => (int) $data->toilet_girl, 
                    'toilet_boy' => (int) $data->toilet_boy, 
                    'toilet_total' => $data->toilet_total, 
                    'toilet_ratio' => $data->toilet_ratio, 
                    'toilet_girl_ratio' => $data->toilet_girl_ratio, 
                    'toilet_boy_ratio' => $data->toilet_boy_ratio, 
                    'toilet_toilet_location' => $data->toilet_location, 
                    'school_id' => $data->identifier,
                    'government_funds' => (int) $data->government_funds,
                    'toilet-type' => $toilet,
                    'water-source' => $water,
                    'wash-club' => $data->wash_club,
                    'washing-facilities' => $data->washing_facilities,
                    'annual-grant' => $data->annual_grant,
                    'community-support' => $data->community_support,
                    'cleaning-schedule' => $data->cleaning_schedule,
                    'teacher-training-or-workshop' => $data->training,
                    'status' => 'active',
                    'province-master' => 'active',
                    'school-type-master' => 'active'
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
            ->whereNotNull('EX')
            ->groupby('EX')
            ->get();
        return $db;
    }

    public function indicators()
    {
        $db = $this->select('N')
            ->groupby('N')
            ->get('N');
        return $db;
    }

    public function search($q)
    {
        $db = $this->select('L as school', 'A as identifier', 'EU as latitude', 'EV as longitude')
            ->where('school', 'LIKE', '%'.$q.'%')
            ->orWhere('identifier', 'LIKE', '%'.$q.'%')
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
            'P', 
            'R', 
            'L', 
            'A',
            DB::raw('(S + T) as total_students'),
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
        return $this->select(
            DB::raw('(`20490967` + `22530927` + `27360922`) as t_toilets'),
            '22530927 as t_girls',
            '27360922 as t_boys'
        )->get();
    }

}
