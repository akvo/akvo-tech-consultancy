<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use App\Group;
use App\Country;
use App\CountryGroup;
use App\CountryValue;
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
                         ->has('country_values')
                         ->with('country_values.country');
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

    public function getValueByCategory(Request $request, Value $values, CountryValue $country_value, Group $groups)
    {
        $values = $values->where('id', $request->id)
                         ->with('childrens.country_values.country')
                         ->first();
        $values = $values->childrens->transform(function($child) {
            $child->country_values = collect($child->country_values)->transform(function($country_value) {
                $country_value->country = $country_value->group->transform(function($group) use ($country_value) {
                    return $group->group;
                });
                return $country_value;
            });
            $child->total = array(
                'values' => $child->country_values->sum('value'),
                'countries' => $child->country_values->count('country_values')
            );
            $child->parents = $child->parents;
            $child->parents = $child->parents->map(function($parents){
                return $parents->parents;
            });
            return $child;
        });
        return $values;
    }

    public function getValueById(Request $request, Value $values)
    {
        return $values->where('id', $request->id)
                      ->with('country_values.country')
                      ->with('parents')
                      ->first();
    }

    public function deleteGroup(Request $request, Value $values, Country $countries)
    {
        return $countries->with('groups')->get();

        $ids = $values
            ->whereNotNull('parent_id')
            ->has('childrens')
            ->doesntHave('childrens.country_values')
            ->with('childrens.country_values')
            ->withCount('childrens')
            ->get()->pluck('childrens')->flatten()->pluck('id');
        return $ids;
    }
}
