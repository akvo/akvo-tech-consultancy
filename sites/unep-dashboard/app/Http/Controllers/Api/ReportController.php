<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Country;
use App\Group;
use App\Value;
use App\Datapoint;
use App\DatapointCountry;
use App\DatapointValue;
use App\Question;
use App\Answer;

class ReportController extends Controller
{
    public function __construct()
    {
        $this->collection = collect();
    }

    public function download(
        Request $request, Datapoint $dp, DatapointCountry $dpc,
        DatapointValue $dpv
    )
    {
        // $global = $request->input('global');
        // $countries = $request->input('countries');
        // $groups = $request->input('countrygroups');
        // $filters = $request->input('filters');
        $images = $request->input('images');

        // $dpcs = $dpc->whereIn('country_id', $countries)->pluck('datapoint_id')->unique();
        // $dpvs = $dpv->whereIn('value_id', $filters)->pluck('datapoint_id')->unique();

        // dump($dpcs);
        // dump($dpvs); 
        // die();
        return view('report', ['images' => $images]);
    }
}
