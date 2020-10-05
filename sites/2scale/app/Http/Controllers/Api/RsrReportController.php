<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use App\RsrProject;

class RsrReportController extends Controller
{
    public function generateReport(Request $r)
    {
        $partnershipId = $r->input('partnership_id');
        if ($r->input('partnership_id') === "0") {
            $partnershipId = null;
        }
        $rsrProject = RsrProject::where('partnership_id', $partnershipId)
                        ->with(['rsr_results' => function($query) {
                            $query->orderBy('order');
                            $query->with('rsr_indicators.rsr_dimensions.rsr_dimension_values');
                            $query->with('rsr_indicators.rsr_periods.rsr_period_dimension_values');
                        }])->first();
        
        $rsrProject['rsr_results'] = $rsrProject['rsr_results']->map(function ($res) {
            $res['rsr_indicators'] = $res['rsr_indicators']->map(function ($ind) {
                $ind['period_actual_sum'] = $ind['rsr_periods']->pluck('actual_value')->sum();
                if ($ind['has_dimension']) {
                    // collect dimensions value all period
                    $periodDimensionValues = $ind['rsr_periods']->map(function ($per) {
                        return $per['rsr_period_dimension_values'];
                    })->flatten(1);
                    // aggregate dimension value
                    $ind['rsr_dimensions'] = $ind['rsr_dimensions']->map(function ($dim) 
                        use ($periodDimensionValues) {
                        $dim['rsr_dimension_values'] = $dim['rsr_dimension_values']->map(function ($dimVal) 
                            use ($periodDimensionValues) {
                            $dimVal['period_actual_sum'] = $periodDimensionValues->where('rsr_dimension_value_id', $dimVal['id'])
                                    ->pluck('value')
                                    ->sum();
                            return $dimVal;
                        });
                        return $dim;
                    });
                }
                return Arr::except($ind, 'rsr_periods');
            });
            return $res;
        });
        // return $rsrProject;
        $data = [
            "filename" => $r->input('filename'),
            "project" => $rsrProject,
            // "updates" => $this->getUpdates($rsr, $projectId),
            "updates" => [],
            "columns" => $r->input('columns'),
            "charts" => $this->b64toImage($r),
            "titles" => $r->input('titles'),
        ];
        // return $data;
        $html = view('reports.template2', ['data' => $data])->render();
        $filename = (string) Str::uuid().'.html';
        Storage::disk('public')->put('./reports/'.$filename, $html);
        return Storage::disk('public')->url('reports/'.$filename);
    }

    public function b64toImage($requests)
    {
        $base64_images = $requests->input('images');
        $files = collect();
        foreach($base64_images as $key => $image) {
            $filename = $requests->input('filename').'-'.$key.'.png';
            if (preg_match('/^data:image\/(\w+);base64,/', $image)) {
                $data = substr($image, strpos($image, ',') + 1);
                $data = base64_decode($data);
                Storage::disk('public')->put('./images/'.$filename, $data);
                $files->push($filename);
            }
        }
        return $files;
    }
}
