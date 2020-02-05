<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use App\Group;
use App\Country;
use App\CountryGroup;
use App\Value;

class ChartController extends Controller
{
    public function getCountryValues(Country $countries, Value $values)
    {
        return $countries->has('values')->with('values.parents.parents')->get();
    }

    public function getAllValues(Country $countries, Value $values)
    {
        $values = $values->select('id','code','name','units')
                         ->has('country_values')->with('country_values.country');
        $values = $values->get()->transform(function($q){
            $q->value = $q->country_values->map(function($b){
                return $b->value;
            })->sum();
            $q->country_values->transform(function($b){
                return array($b->country->code => $b->value);
            });
            return $q;
        });
        return $values;
    }
}
