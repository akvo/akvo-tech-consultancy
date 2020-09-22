<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Datapoint;
use App\Value;

class ReportController extends Controller
{
    public function __construct()
    {
        $this->collection = collect();
        $this->code = collect();
    }

    public function download(Request $r, Datapoint $dp, Value $vl)
    {
        $global = $r->input('global');
        $charts = $r->input('images');
        $blocks = $r->input('blocks');

        if (!$r->input('datapoints') || count($r->input('datapoints')) > 20) {
            return ["status" => false];
        }

        $ex = collect(config('report.ex_indicators'));
        $vls = $vl->whereNull('parent_id')->has('childrens')->with('childrens')->get();
        $vls = $vls->filter(function ($x) use ($ex) {
            if (!$ex->contains($x['code'])) {
                return $x;
            }
        });

        $dps = $dp->whereIn('id', $r->input('datapoints'))
                  ->with(['title', 'keywords', 'info', 'countries.country', 'values.value.parents'])
                  ->get();

        $dps->transform(function ($q) use ($vls) {
            $q['countries'] = $q['countries']->transform(function ($c) {
                $this->collection->push($c->country->name);
                $this->code->push($c->country->code);
                return $c->country->name;
            });

            $indicators = $q['indicators'] = collect($q->values)->reject(function ($v) {
                return $v->value->childrens->count() !== 0;
            })->values()->pluck('value_id');
            $newIndicators = collect($vls)->map(function ($val) use ($indicators) {
                return $this->fillIndicators(collect($val), collect($indicators));
            });

            return [
                "id" => $q['id'],
                "title" => $q['title']->value,
                "info" => $q['info']->value,
                "keywords" => $q['keywords']->value,
                "funds" => $q['funds'],
                "contribution" => $q['contribution'],
                "countries" => $q['countries'],
                "indicators" => $newIndicators
            ];
        });
        $results = [
            "all_countries" => $this->collection->unique(),
            "datapoints" => $dps,
            "charts" => $charts,
            "blocks" => $blocks, // 1 (colspan 2), 2 (no colspan)
        ];
        $title = "UNEP_STOCKTAKE_REPORT-";
        $title .= implode('-', $this->code->unique()->values()->toArray());
        return view('report', ['data' => $results, 'title' => $title]);
    }

    private function fillIndicators($parent, $indicators)
    {
        if (count($parent["childrens"]) === 0) {
            $parent["value"] = false;
        }
        if ($indicators->contains($parent["id"])) {
            $parent["value"] = true;
        }
        if (count($parent["childrens"]) > 1) {
            $parent["childrens"] = collect($parent['childrens'])->map(function ($val) use ($indicators) {
                return $this->fillIndicators(collect($val), $indicators);
            });
            $parent["value"] = $parent["childrens"]->map(function ($val) {
                return $val['value'];
            })->reject(function ($x) {
                return !$x;
            })->values();
            $parent["value"] = count($parent["value"]) === 0 ? false : true;
            $parent["childrens"] = $parent["childrens"]->reject(function ($val) {
                return !$val["value"];
            })->values();
        }

        return $parent;
    }
}
