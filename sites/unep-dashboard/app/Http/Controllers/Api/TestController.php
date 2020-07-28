<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use App\Datapoint;
use App\Value;
use App\DatapointValue;
use App\DatapointCountry;
use Faker\Factory as Faker;

class TestController extends Controller
{
    public function datapoints(Datapoint $datapoints)
    {
        $datapoints = $datapoints
            ->has('countries')
            ->with('values')
            ->withCount('countries')
            ->get();
        return $datapoints;
    }

    public function values(Value $values)
    {
        $values = $values
            ->whereNull('parent_id')
            ->whereNotIn('code',['43380772'])
            ->with('childrens')
            ->get();
        return $values;
    }

    public function countryvalues(DatapointValue $values)
    {
        $values = $values
            ->has('countries')
            ->with('countries')
            ->get();
        $values = $values->transform(function($v){
            $v->countries->transform(function($c){
                return $c->country_id;
            });
            return $v;
        });
        return $values;
    }

}
