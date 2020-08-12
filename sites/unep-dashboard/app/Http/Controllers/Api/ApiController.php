<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Collection;
use Illuminate\Http\Request;
use App\Datapoint;
use App\Value;
use App\Country;
use App\DatapointValue;
use App\DatapointCountry;

class ApiController extends Controller
{
    public function __construct()
    {
        $this->collection = collect();
    }

    public function filters(Value $values)
    {
        $filters = $values
            ->whereNull('parent_id')
            ->has('childrens')
            ->with('childrens')
            ->get();
        return $filters;
    }

    public function countries(Country $countries)
    {
        return $countries->with('groups')->get();
    }

    public function data(Datapoint $datapoints)
    {
        $datapoints = $datapoints
            ->has('countries')
            ->with(['countries', 'values', 'title'])
            ->get();
        $datapoints = $datapoints->transform(function($q) {
            $q->countries = $q->countries->transform(function($v){
                $this->collection->push($v->country_id);
                return $v->country_id;
            });
            $q->values = $q->values->transform(function($v){
                return $v->value_id;
            });
            return [
                'id' => $q->id,
                'country' => $q->countries,
                'values' => $q->values,
                'global' => $q->countries->count() === 1 ? False : True,
                'funds' => $q->funds,
                'contrib' => $q->contribution,
                'title' => $q->title['value']
            ];
        });
        $activities = $this->collection->countBy();
        $this->collection = collect($datapoints)
            ->where('global', False)
            ->values()
            ->pluck('country')
            ->flatten(0)
            ->countBy();

        $activities = $activities->map(function($v, $c) use ($datapoints) {
            $dps = $datapoints->reject(function($v) use ($c) {
                return collect($v['country'])->contains($c) ? false : true;
            })->values();
            $vid = $dps->pluck('values')->flatten()->unique()->values();
            $vid = $vid->map(function($id) use ($dps){
                $dp = $dps->reject(function($d) use ($id){
                    return collect($d['values'])->contains($id) ? false : true;
                })->pluck('id');
                return [
                    'id' => $id,
                    'datapoints' => $dp,
                    'total' => count($dp)
                ];
            });
            return [
                'country_id' => $c,
                'global' => $v,
                'total' => isset($this->collection[$c]) ? $this->collection[$c] : 0,
                'values' => $vid
            ];
        })->values();
        $datapoints = $datapoints->map(function($d){
            return [
                'title' => $d['title'],
                'datapoint_id' => $d['id'],
                'global' => $d['global'],
                'f' => $d['funds'],
                'c' => $d['contrib'],
            ];
        });
        return [
            'data' => $activities,
            'datapoints' => $datapoints
        ];
    }

    public function test(Datapoint $dp)
    {
        return $dp->where('id', 3)
                    ->with('title')
                    ->with(['values.value', 'countries.country'])
                    ->first();
    }
}
