<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Value;
use App\Country;

class PageController extends Controller
{
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

}
