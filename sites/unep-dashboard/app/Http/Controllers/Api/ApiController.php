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

    private function fillIndicators($parent, $indicators)
    {
        if (count($parent["childrens"]) === 0) {
            $parent["value"] = false;
        }
        if ($indicators->contains($parent["id"])) {
            $parent["value"] = true;
        }
        if (count($parent["childrens"]) > 1) {
            $parent["childrens"] = collect($parent['childrens'])->map(function ($val) use ($indicators) {
                return $this->fillIndicators(collect($val), $indicators);
            });
            $parent["value"] = $parent["childrens"]->map(function ($val) {
                return $val['value'];
            })->reject(function ($x) {
                return !$x;
            })->values();
            $parent["value"] = count($parent["value"]) === 0 ? false : true;
            $parent["childrens"] = $parent["childrens"]->reject(function ($val) {
                return !$val["value"];
            })->values();
        }
        return $parent;
    }

    public function test(Datapoint $dp, Value $vl)
    {
        $vls = $vl->whereNull('parent_id')->has('childrens')->with('childrens')->get();
        $dps = $dp->whereIn('id', [3,4, 100])
                  ->with(['title', 'keywords', 'info', 'countries.country', 'values.value.childrens'])
                  ->get();

        $dps->transform(function ($q) use ($vls) {
            $q['countries'] = $q['countries']->transform(function ($c) {
                $this->collection->push($c->country->name);
                return $c->country->name;
            });

            $indicators = $q['indicators'] = collect($q->values)->reject(function ($v) {
                return $v->value->childrens->count() !== 0;
            })->values()->pluck('value_id');
            $newIndicators = collect($vls)->map(function ($val) use ($indicators) {
                return $this->fillIndicators(collect($val), collect($indicators));
            });
            return [
                "id" => $q['id'],
                "title" => $q['title']->value,
                "info" => $q['info']->value,
                "keywords" => $q['keywords']->value,
                "funds" => $q['funds'],
                "contribution" => $q['contribution'],
                "countries" => $q['countries'],
                "indicators" => $newIndicators
            ];
        });
        return $dps;
    }
}
