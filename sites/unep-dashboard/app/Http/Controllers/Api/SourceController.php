<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Group;
use App\Country;
use App\CountryGroup;
use App\Value;

class SourceController extends Controller
{
    public function getGroups(Group $groups)
    {
        return $groups->whereNull('parent_id')->with('childrens.childrens')->get();
    }

    public function getCountries(Country $countries)
    {
        return $countries->with('groups')->get();
    }

    public function getValues(Value $values)
    {
        return $values->whereNull('parent_id')->with('childrens.childrens')->get();
    }

    public function getVariables(Value $values)
    {
        return $values->doesnthave('childrens')->with('parents.parents')->get();
    }

}
