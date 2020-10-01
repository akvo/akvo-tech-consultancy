<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use App\Models\Form;
use App\Models\Variable;
use App\Models\Option;
use App\Models\Answer;
use App\Models\FormInstance;
use App\Helpers\Utils;

class ApiController extends Controller
{

    public function filters(Form $form)
    {
        $data = $form->get()->groupBy('country');
        $data = collect($data)->map(function($list, $key){
            return [
                'name' => $key,
                'childrens' => $list->makeHidden('country')
            ];
        })->values();
        return $data;
    }

    public function countryData(Request $request)
    {
        $form_id = (int) $request->id;
        $form = Form::where('id',$form_id)
                       ->withCount('formInstances')
                       ->first();
        $total = $form->form_instances_count;
        $first_crop = Utils::getValues($form_id, 'f_first_crop');
        $first_crop = Utils::getMax($first_crop);
        $second_crop = Utils::getValues($form_id, 'f_second_crop');
        $dedicated = collect($second_crop)
            ->where('name', "I don't have a second main crop")
            ->values()
            ->first();
        $farm_size = Utils::getValues($form_id, 'f_size (acre)');
        return [
            [
                'id' => $form_id,
                'title' => "Household Surveyed",
                'data' => [
                    'records' => Utils::getValues($form_id, 'pi_location_cascade_county'),
                    'maps' => strtolower($form->country),
                ],
                'kind' => 'MAPS',
                'description' => false,
                'width' => 6
            ],[
                'id' => $form_id,
                'title' => "Was the farmer surveyed part of the sample?",
                'data' => Utils::getValues($form_id, 'farmer_sample'),
                'kind' => 'PIE',
                'description' => false,
                'width' => 4,
            ],[
                'id' => $form_id,
                'title' => false,
                'data' => [
                    [
                        'id' => $form_id,
                        'title' => false,
                        'data' => $total,
                        'kind' => 'NUM',
                        'description' => 'Of the farmers are included in the analysis',
                        'width' => 12
                    ],[
                        'id' => $form_id,
                        'title' => false,
                        'data' => round($first_crop['value'] / $total, 2) * 100,
                        'kind' => 'PERCENT',
                        'description' => 'Of the farmers main crop was '.$first_crop['name'],
                        'width' => 12
                    ],[
                        'id' => $form_id,
                        'title' => false,
                        'data' => round(collect($farm_size)->avg(), 2),
                        'kind' => 'NUM',
                        'description' => 'Acres is the avarage farm size',
                        'width' => 12
                    ],[
                        'id' => $form_id,
                        'title' => false,
                        'data' => 100 - (round($dedicated['value'] / $total, 2) * 100),
                        'kind' => 'PERCENT',
                        'description' => 'Of the farmers had more than one crop',
                        'width' => 12
                    ]
                ],
                'id' => $form_id,
                'kind' => 'CARDS',
                'description' => false,
                'width' => 2,
            ]
        ];
    }

    public function compareData(Request $request)
    {
        $form_id = (int) $request->id;
        $variables = Utils::completeVariables();
        $collection = collect();
        $total = FormInstance::where('form_id', $form_id)->count();
        foreach($variables as $variable) {
            $desc = $variable->text;
            $data = Utils::getValues($form_id, $variable->name);
            $data = $variable->type === "number" ? round($data->avg(),2) : $data;
            $kind = $variable->type === "option" ? "PIE" : "NUM";
            if ($kind === "NUM") {
                $desc = 'Average of ' . strtolower($desc);
            }
            if ($kind === "PIE") {
                $kind = count($data) > 5 ? "BAR" : $kind;
            }
            $data = [
                'id' => $form_id,
                'title' => $variable->text,
                'data' => $data,
                'kind' => $kind,
                'description' => $desc,
                'width' => 12,
            ];
            $collection->push($data);

            if ($kind === "PIE" || $kind === "BAR") {
                $secondary_data = $this->getPercentage($data['data'], $total, $desc);
                $secondary = [
                    'id' => $form_id,
                    'title' => $variable->text,
                    'data' => $secondary_data['value'],
                    'kind' => "PERCENT",
                    'description' => $secondary_data['desc'],
                    'width' => 12
                ];
                $collection->push($secondary);
            }
        }
        return $collection;
    }

    public function getPercentage($data, $total, $variable)
    {
        $data = Utils::getMax($data);
        return [
            'value' => round($data['value'] / $total, 1) * 100,
            'desc' => 'Of the ' . strtolower($variable) . ' was '.$data['name'],
        ];
    }

}
