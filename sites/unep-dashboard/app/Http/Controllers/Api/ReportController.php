<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Country;
use App\Group;
use App\Value;
use App\Datapoint;
use App\Question;
use App\Answer;
use PDF;

class ReportController extends Controller
{
    public function __construct()
    {
        $this->collection = collect();
    }

    public function download(
        Request $r, Datapoint $dp, Question $q,
        Country $cty, Group $gp, Value $vl
    )
    {
        $global = $r->input('global');
        $charts = $r->input('images');

        if (!$r->input('datapoints') || count($r->input('datapoints')) > 20) {
            return ["status" => false];
        }

        $countries = [];
        if ($r->input('countries')) {
            $countries = $r->input('countries');
        }

        $cgroups = [];
        if ($r->input('countrygroups')) {
            $cgroups = $r->input('countrygroups');
        }

        $filters = [];
        if ($r->input('filters')) {
            $filters = $r->input('filters');
            $vls = $vl->whereIn('id', $filters)->get();
        }

        $qs = $q->get();
        $vls = $vl->whereNull('parent_id')->with('childrens')->get();
        $ctys = $cty->whereIn('id', $countries)->get();
        $gps = $gp->whereIn('id', $cgroups)->get();

        $dps = $dp->whereIn('id', $r->input('datapoints'))
                  ->with([
                    'countries' => function ($query) use ($countries) {
                        if (count($countries) > 0) {
                            $query->whereIn('country_id', $countries);
                        }
                        $query->with('country');
                    },
                    'values' => function ($query) use ($filters) {
                        if (count($filters) > 0) {
                            $query->whereIn('value_id', $filters);
                        }
                        $query->with('value.parents');
                    },
                    'answers' => function ($query) {
                        $query->whereNotNull('value');
                        $query->with([
                            'question', 
                            'question.parents.parents', 
                            'question.value.parents.parents'
                        ]);
                    }
                  ])->get();
        
        $results = [
            "datapoints" => $dps,
            "filters" => $vls,
            "countries" => $ctys,
            "groups" => $gps,
            "charts" => $charts,
        ];
        // return $results;
        return view('report', ['data' => $results]);
        // $pdf = PDF::loadView('report', ['data' => $results]);
        // return $pdf->download('report.pdf');
    }
}
