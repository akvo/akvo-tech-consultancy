<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Country;
use App\Value;
use App\CountryValue;

class TestController extends Controller
{
    public function test(Country $countries, Value $values, CountryValue $countryvalues)
    {
        return $values->with('countries')->get();
    } 
}
