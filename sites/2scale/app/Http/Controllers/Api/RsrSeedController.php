<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Libraries\AkvoRsr;
use App\Partnership;
use App\RsrProject;
use App\RsrResult;
use App\RsrIndicator;
use App\RsrPeriod;
use App\RsrDimension;
use App\RsrDimensionValue;
use App\RsrPeriodDimensionValue;
use App\RsrPeriodData;
use App\RsrTitle;
use App\RsrTitleable;
use Carbon\Carbon;
use Illuminate\Support\Arr;

class RsrSeedController extends Controller
{
    public function __construct()
    {
        $this->rsr = new AkvoRsr();
        $this->collections = collect();
        $this->periods = collect();
        $this->periodData = collect();
        $this->dimensions = collect();
    }

    public function seedRsr(
        Partnership $partnership, RsrProject $project, RsrResult $result, RsrIndicator $indicator, 
        RsrPeriod $period, RsrDimension $dimension, RsrDimensionValue $dimensionValue, 
        RsrPeriodDimensionValue $periodDimensionValue, RsrPeriodData $periodData
    )
    {
        $this->seedRsrProjects($partnership, $project);
        $this->seedRsrResults($project, $result, $indicator, $period,  $dimension,  $dimensionValue, $periodDimensionValue, $periodData);
        return "Done";
    }

    public function seedRsrProjects(Partnership $partnership, RsrProject $project)
    {
        $this->collections = collect();
        $parentId = config('akvo-rsr.projects.parent');
        $parent = $this->getProject($parentId);
        $parent['partnership_id'] = null;
        $this->collections->push($parent);
        
        $partnership->with('parents')->get()->each(function ($val) {
            $config = $val['code'].'.parent';
            if ($val['parent_id'] !== null) {
                $config = $val['parents']['code'].'.childs.'.$val['code'];
            }
            $projectId = config('akvo-rsr.projects.childs.'.$config);

            if ($projectId !== null) {
                $data = $this->getProject($projectId);
                $data['partnership_id'] = $val['id'];
                $this->collections->push($data);
            }
        });

        $projects = $this->collections->map(function ($val) use ($project) {
            if (!isset($val['id'])) {
                return $val;
            }
            return $project->updateOrCreate(
                ['id' => $val['id']],
                [
                    'id' => $val['id'], 
                    'partnership_id' => $val['partnership_id'],
                    'title' => $val['title'],
                    'subtitle' => $val['subtitle'],
                    'currency' => $val['currency'],
                    'budget' => floatval($val['budget']),
                    'funds' => floatval($val['funds']),
                    'funds_needed' => floatval($val['funds_needed']),
                    'project_plan_summary' => $val['project_plan_summary'],
                    'goals_overview' => $val['goals_overview'],
                    'background' => $val['background'],
                    'sustainability' => $val['sustainability'],
                    'current_image' => $val['current_image'],
                    'current_image_caption' => $val['current_image_caption'],
                    'status_label' => $val['status_label'],
                    'date_start_planned' => ($val['date_start_planned'] === null) ? $val['date_start_planned'] : Carbon::createFromFormat('Y-m-d', $val['date_start_planned'])->toDateString(),
                    'date_start_actual' => ($val['date_start_actual'] === null) ? $val['date_start_actual'] : Carbon::createFromFormat('Y-m-d', $val['date_start_actual'])->toDateString(),
                    'date_end_planned' => ($val['date_end_planned'] === null) ? $val['date_end_planned'] : Carbon::createFromFormat('Y-m-d', $val['date_end_planned'])->toDateString(),
                    'date_end_actual' => ($val['date_end_actual'] === null) ? $val['date_end_actual'] :Carbon::createFromFormat('Y-m-d', $val['date_end_actual'])->toDateString(),
                ],
            );
        });
        return $projects;
    }

    private function getProject($projectId)
    {
        $projects = $this->rsr->get('projects', 'id', $projectId);
        if ($projects['count'] == 0) {
            return [];
        }
        return $projects['results'][0];
    }

    public function seedRsrResults(
        RsrProject $project, RsrResult $result, RsrIndicator $indicator, 
        RsrPeriod $period, RsrDimension $dimension, RsrDimensionValue $dimensionValue,
        RsrPeriodDimensionValue $periodDimensionValue, RsrPeriodData $periodData
    )
    {
        $this->collections = collect();
        $this->periods = collect();
        $this->dimensions = collect();
        $this->periodData = collect();

        $results = $project->all()->map(function ($val) {
            return $this->getResults($val['id']);
        })->flatten(2)->reject(function ($val) {
            return count($val) === 0;
        });

        $resultTable = collect($results)->map(function ($val) use ($result) {
            if ($val['parent_result'] !== null && count($result->all()) !== 0 && $result->find($val['parent_result']) === null) {
                return [];
            }
            $this->collections->push($val['indicators']);
            $results = $result->updateOrCreate(
                ['id' => $val['id']],
                [
                    'id' => $val['id'],
                    'rsr_project_id' => $val['project'],
                    'parent_result' => $val['parent_result'],
                    // 'title' => $val['title'],
                    // 'description' => $val['description'],
                    'order' => $val['order'],
                ]
            );
            $this->seedRsrTitleable($val, 'App\RsrResult');
            return $results;
        });
        
        $indicatorTable = $this->collections->flatten(1)->map(function ($val) use ($indicator) {
            $this->periods->push($val['periods']);
            $has_dimension = false;
            if (count($val['dimension_names']) > 0) {
                $has_dimension = true;
                $this->dimensions->push(
                    [
                        "indicator_id" => $val['id'],
                        "dimension_names" => $val['dimension_names'],
                        "disaggregation_targets" => $val['disaggregation_targets']
                    ]
                );
            }
            $indicators = $indicator->updateOrCreate(
                ['id' => $val['id']],
                [
                    'id' => $val['id'],
                    'rsr_result_id' => $val['result'],
                    'parent_indicator' => $val['parent_indicator'],
                    // 'title' => $val['title'],
                    // 'description' => $val['description'],
                    'baseline_year' => $val['baseline_year'],
                    'baseline_value' => floatval($val['baseline_value']),
                    'target_value' => floatval($val['target_value']),
                    'order' => $val['order'],
                    'has_dimension' => $has_dimension,
                ],
            );
            $this->seedRsrTitleable($val, 'App\RsrIndicator');
            return $indicators;
        });

        // transform
        $dimensionTransform = $this->dimensions->transform(function ($val) {
            return collect($val['dimension_names'])->transform(function ($d) use ($val) {
                $dimensions = [
                    'id' => $d['id'],
                    'rsr_indicator_id' => $val['indicator_id'],
                    'rsr_project_id' => $d['project'],
                    'parent_dimension_name' => $d['parent_dimension_name'],
                    'name' => $d['name']
                ];
                $dimension_values = collect($d['values'])->transform(function ($v) use ($val) {
                    $value = null;
                    if (count($val['disaggregation_targets']) > 0) {
                        $find = collect($val['disaggregation_targets'])->firstWhere('dimension_value', $v['id']);
                        $value = $find['value'];
                    }
                    return [
                        'id' => $v['id'],
                        'rsr_dimension_id' => $v['name'],
                        'parent_dimension_value' => $v['parent_dimension_value'],
                        'name' => $v['value'],
                        'value' => floatval($value),
                    ];
                });
                return [
                    'dimensions' => $dimensions,
                    'dimension_values' => $dimension_values,
                ];
            });
        });

        $dimensionTable = $dimensionTransform->flatten(1)->map(function ($val) use ($dimension, $dimensionValue) {
            $dimension_values = $dimension->updateOrCreate(['id' => $val['dimensions']['id']], Arr::except($val['dimensions'], 'name'));
            $this->seedRsrTitleable($val['dimensions'], 'App\RsrDimension');
            $values = collect($val['dimension_values'])->map(function ($v) use ($dimensionValue) {
                $dimensionValues = $dimensionValue->updateOrCreate(['id' => $v['id']], Arr::except($v, 'name'));
                $this->seedRsrTitleable($v, 'App\RsrDimensionValue');
                return $dimensionValues;
            });
            return $dimension_values;
        });

        $this->collections = collect();
        $periodTable = $this->periods->flatten(1)->map(function ($val) use ($period) {
            if (count($val['disaggregations']) > 0) {
                $val['disaggregations']['period'] = $val['id'];
                $this->collections->push($val['disaggregations']); // dimension value updated per period
            }
            if (count($val['data']) > 0) {
                $this->periodData->push($val['data']);
            }
            return $period->updateOrCreate(
                ['id' => $val['id']],
                [
                    'id' => $val['id'],
                    'rsr_indicator_id' => $val['indicator'],
                    'parent_period' => $val['parent_period'],
                    'target_value' => floatval($val['target_value']),
                    'actual_value' => floatval($val['actual_value']),
                    'period_start' => ($val['period_start'] === null) ? $val['period_start'] : Carbon::createFromFormat('Y-m-d', $val['period_start'])->toDateString(),
                    'period_end' => ($val['period_end'] === null) ? $val['period_end'] : Carbon::createFromFormat('Y-m-d', $val['period_end'])->toDateString(),
                ]
            );
        });

        $periodDimValTable = $this->collections->flatten(1)->map(function ($val) use ($dimensionValue, $periodDimensionValue) {
            if ($dimensionValue->find($val['dimension_value']) === null) {
                return [];
            }
            return $periodDimensionValue->updateOrCreate(
                ['id' => $val['id']],
                [
                    'id' => $val['id'],
                    'rsr_period_id' => $val['period'],
                    'rsr_dimension_value_id' => $val['dimension_value'],
                    'value' => ($val['value'] === null) ? $val['value'] : floatval($val['value']),
                ]
            );
        });

        $periodDataTable = $this->periodData->flatten(1)->map(function ($val) use ($period, $periodData) {
            if ($period->find($val['period']) === null) {
                return [];
            }
            return $periodData->updateOrCreate(
                ['id' => $val['id']],
                [
                    'id' => $val['id'],
                    'rsr_period_id' => $val['period'],
                    'value' => ($val['value'] === null) ? $val['value'] : floatval($val['value']),
                    'text' => $val['text'],
                    'created_at' => Carbon::createFromFormat('Y-m-d\TH:i:s.u', $val['created_at'])->toDateTimeString(),
                    'updated_at' => Carbon::createFromFormat('Y-m-d\TH:i:s.u', $val['last_modified_at'])->toDateTimeString()
                ]
            );
        });
        return;
    }

    private function seedRsrTitleable($titleData, $type)
    {
        // seed Title
        $titles = [];
        if ($type === 'App\RsrResult' || $type === 'App\RsrIndicator') {
            $titles['title'] = $titleData['title'];
            if (strlen($titleData['description']) > 0 || $titleData['description'] !== null) {
                $titles['description'] = $titleData['description'];
            }
        }
        if ($type === 'App\RsrDimension' || $type === 'App\RsrDimensionValue') {
            $titles['title'] = $titleData['name'];
        }
        $title = RsrTitle::where('title', $titles['title'])->first();
        if (!$title) {
            $title = RsrTitle::updateOrCreate($titles, $titles);
        } 

        // seed Titleable
        $titleable = [];
        $titleable['rsr_title_id'] = $title->id;
        $titleable['rsr_titleable_id'] = $titleData['id'];
        $titleable['rsr_titleable_type'] = $type;
        return RsrTitleable::updateOrCreate($titleable, $titleable);
    }

    private function getResults($projectId)
    {
        $data = collect();
        $results = $this->rsr->get('results', 'project', $projectId);
        if ($results['count'] == 0) {
            return [];
        }
        $data->push($results['results']);
        // fetch next page
        while($results['next'] !== null){
            $results = $this->rsr->fetch($results['next']);
            if ($results['count'] !== 0) {
                $data->push($results['results']);
            }
        }
        return $data;
    }
}