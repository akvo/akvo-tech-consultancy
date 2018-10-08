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
    public function getRegistrationAttribute()
    {
        return (int) $this->attributes['22480946'];
    }

    public function maps($excepts)
    {
        $db = collect($this->all(
            'longitude',
            'latitude',
			'identifier',
            '28390923 as school_name', 
            '20510942 as separated', 
            '22490945 as has_toilets' 
		))->map(function($data) use ($excepts) {
			$toilet = '1';
			if ($data->has_toilets === 'Yes')
			{
				$toilet = '5';
			}
			if($data->separated === 'Yes')
			{
				$toilet = '4';
			}
            if (in_array($toilet, $excepts)){
                return;
            }
			$results = array(
                'geometry' => array(
                    'type' => 'Point',
                    'coordinates' => array((float)$data->longitude, (float)$data->latitude),
                ),
                'type' => 'Feature',
                'properties' => array(
                    'school_name' => $data->school_name,
                    'school_id' => $data->identifier,
                    'has_toilet' => $data->has_toilet,
                    'toilets' => $toilet,
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

    public function search($q)
    {
        $db = $this->select('28390923 as school', 'identifier', 'latitude', 'longitude')
            ->where('school', 'LIKE', '%'.$q.'%')
            ->orWhere('identifier', 'LIKE', '%'.$q.'%')
            ->take(5)->get();
        return $db;
    }

    public function details($id)
    {
        $db = $this->where('identifier', $id)->first();
        return $db;
    }

    public function datatable()
    {
        return $this->select(
            '28390923', 
            '23430921', 
            '22480946', 
            'identifier',
            '26390924',
            DB::raw('(`23430922` + `28390924`) as total_students'),
            '28390924 as s_girls',
            '23430922 as s_boys',
            DB::raw('(`20490967` + `22530927` + `27360922`) as t_toilets'),
            '20510942 as s_toilet',
            '22530927 as t_girls',
            '27360922 as t_boys'
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
