<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Datapoint;
use PDF;
use Storage;

class ReportController extends Controller
{
    public function __construct()
    {
        $this->collection = collect();
    }

    public function download(Request $r, Datapoint $dp)
    {
        $global = $r->input('global');
        $charts = $r->input('images');
        // $chartNames = $r->input('images_name');

        if (!$r->input('datapoints') || count($r->input('datapoints')) > 20) {
            return ["status" => false];
        }

        $dps = $dp->whereIn('id', $r->input('datapoints'))
                  ->with(['title', 'keywords', 'info', 'countries.country', 'values.value.parents'])
                  ->get();
        $dps->transform(function ($d) {
            $d->countries = $d->countries->transform(function ($c) {
                $this->collection->push($c->country->name);
                return $c->country->name;
            });
            $d->values = $d->values->map(function ($child) {
                return $child->value->parents->map(function ($p1) use ($child) {
                    if ($p1->parents->count() === 0) {
                        return [
                            "parent" => $p1->name,
                            "childs" => [
                                "name" => $child->value->name
                            ],
                        ];
                    }
                    if ($p1->parents->count() > 0) {
                        return $p1->parents->map(function ($p2) use ($p1, $child) {
                            if ($p2->parents->count() === 0) {
                                return [
                                    "parent" => $p2->name,
                                    "childs" => [
                                        "name" => $p1->name,
                                        "childs" => [
                                            "name" => $child->value->name
                                        ],
                                    ],
                                ];
                            }
                            if ($p2->parents->count() > 0) {
                                return $p2->parents->map(function ($p3) use ($p1, $p2, $child) {
                                    return [
                                        "parent" => $p3->name,
                                        "childs" => [
                                            "name" => $p2->name,
                                            "childs" => [
                                                "name" => $p1->name,
                                                "childs" => [
                                                    "name" => $child->value->name
                                                ],
                                            ]
                                        ],
                                    ];
                                })[0];
                            }
                        })[0];
                    }
                })[0];
            });
            return [
                "id" => $d['id'],
                "title" => $d['title']->value,
                "info" => $d['info']->value,
                "keywords" => $d['keywords']->value,
                "funds" => $d['funds'],
                "contribution" => $d['contribution'],
                "countries" => $d['countries'],
                "indicators" => $d['values']
            ];
        });
        $results = [
            "all_countries" => $this->collection->unique(),
            "datapoints" => $dps,
            "charts" => $charts,
            // "chart_names" => $chartNames,
        ];
        // return $results;
        // return view('report', ['data' => $results]);
        $pdf = PDF::loadView('report', ['data' => $results]);
        $pdf->save(storage_path().'/app/public/filename.pdf');
        return Storage::url('filename.pdf');
        // return $pdf->download('report.pdf');
    }
}
