<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Group;
use App\Country;
use App\CountryGroup;
use App\Value;

class PageController extends Controller
{
    public function getDropdownFilters(Value $values)
    {
        return $values->select('id','parent_id','code','name')
                      ->whereNull('parent_id')
                      ->has('childs.childs.country_values')
                      ->with('childs.childs.country_values')
                      ->get();
    }

    public function getDropdownCountries(Country $countries)
    {
        return $countries->has('values')->get();
    }
}
