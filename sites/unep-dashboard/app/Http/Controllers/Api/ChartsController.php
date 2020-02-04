<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use App\Group;
use App\Country;
use App\CountryGroup;

class ChartsController extends Controller
{
    public function test(Group $group, Country $country, CountryGroup $countrygroup)
    {
    }
}
