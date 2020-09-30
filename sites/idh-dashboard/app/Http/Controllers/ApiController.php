<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use App\Models\Form;
use App\Models\Variable;
use App\Models\Option;
use App\Helpers\Utils;

class ApiController extends Controller
{

    public function test()
    {
        return Variable::paginate(10);
        return FormInstance::with('answers.options')->paginate(10);
    }

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
        $form_id = $request->id;
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
                'title' => "Household Surveyed",
                'data' => [
                    'records' => Utils::getValues($form_id, 'pi_location_cascade_county'),
                    'maps' => strtolower($form->country),
                ],
                'kind' => 'MAPS',
                'description' => false,
                'width' => 6
            ],[
                'title' => "Was the farmer surveyed part of the sample?",
                'data' => Utils::getValues($form_id, 'farmer_sample'),
                'kind' => 'PIE',
                'description' => false,
                'width' => 4,
            ],[
                'title' => false,
                'data' => [
                    [
                        'title' => false,
                        'data' => $total,
                        'kind' => 'NUM',
                        'description' => ' Of the farmers are included in the analysis',
                        'width' => 12
                    ],[
                        'title' => false,
                        'data' => round($first_crop['value'] / $total, 2) * 100,
                        'kind' => 'PERCENT',
                        'description' => ' Of the farmers main crop was '.$first_crop['name'],
                        'width' => 12
                    ],[
                        'title' => false,
                        'data' => round(collect($farm_size)->avg(), 2),
                        'kind' => 'NUM',
                        'description' => ' Acres is the avarage farm size',
                        'width' => 12
                    ],[
                        'title' => false,
                        'data' => 100 - (round($dedicated['value'] / $total, 2) * 100),
                        'kind' => 'PERCENT',
                        'description' => ' Of the farmers had more than one crop',
                        'width' => 12
                    ]
                ],
                'kind' => 'CARDS',
                'description' => false,
                'width' => 2,
            ]
        ];
    }

}
