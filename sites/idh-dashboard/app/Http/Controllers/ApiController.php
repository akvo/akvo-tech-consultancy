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

    public function compareData(Request $request)
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
            ->where('name', "No Second Crop")
            ->values()
            ->first();
        $no_second_crop = round((1 - $dedicated['value'] / $total) * 100, 0);
        $farm_size = Utils::getValues($form_id, 'f_size (acre)');
        $second_crop = Utils::getValues($form_id,'f_second_crop');
        $landownership = Utils::getValues($form_id, 'f_ownership');
        $owned_land = collect($landownership)->where('name','I Own All The Land')->first();
        $owned_land = round(($owned_land['value'] / $total) * 100, 0);
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
                    ]
                ],
                'id' => $form_id,
                'kind' => 'CARDS',
                'description' => false,
                'width' => 2,
            ],[
                'data' => [
                    [
                        'id' => $form_id,
                        'title' => false,
                        'data' => 100 - (round($dedicated['value'] / $total, 2) * 100),
                        'kind' => 'PERCENT',
                        'description' => 'Of the farmers had more than one crop',
                        'width' => 12
                    ],[
                        'id' => $form_id,
                        'title' => false,
                        'data' => $no_second_crop,
                        'kind' => 'PERCENT',
                        'description' => 'Of the farmers had more than one crop',
                        'width' => 12
                    ], [
                        'id' => $form_id,
                        'title' => false,
                        'data' => $owned_land,
                        'kind' => 'PERCENT',
                        'description' => 'Of the farmers owns the land they use to grow crops',
                        'width' => 12
                    ],
                ],
                'id' => $form_id,
                'kind' => 'CARDS',
                'description' => false,
                'width' => 2,
            ],[
                'id' => $form_id,
                'title' => "Farmers' land ownership status",
                'data' => $landownership,
                'kind' => 'BAR',
                'description' => false,
                'width' => 5,
            ],[
                'id' => $form_id,
                'title' => "Livestock",
                'data' => collect(Utils::getValues($form_id, 'f_livestock'))->reject(function($data){
                    return Str::contains($data['name'],"No");
                })->values(),
                'kind' => 'BAR',
                'description' => false,
                'width' => 5,
            ]
        ];
    }

    public function countryData(Request $request) {
        $form_id = (int) $request->id;
        $form = Form::where('id',$form_id)
                       ->withCount('formInstances')
                       ->first();
        $total = $form->form_instances_count;
        $farm_size = Utils::getValues($form_id, 'f_size (acre)');
        $household = Utils::getValues($form_id, 'hh_size');
        $overview = [[
            'id' => $form_id,
            'title' => "Household Surveyed",
            'data' => [
                'records' => Utils::getValues($form_id, 'pi_location_cascade_county'),
                'maps' => strtolower($form->country),
            ],
            'kind' => 'MAPS',
            'description' => false,
            'width' => 4
        ],[
            'id' => $form_id,
            'title' => "Was the farmer surveyed part of the sample?",
            'data' => Utils::getValues($form_id, 'farmer_sample'),
            'kind' => 'PIE',
            'description' => false,
            'width' => 4,
        ],[
            'id' => $form_id,
            'title' => "Farmer First Crop",
            'data' => Utils::getValues($form_id, 'f_first_crop'),
            'kind' => 'BAR',
            'description' => false,
            'width' => 4,
        ],[
            'id' => $form_id,
            'data' => [[
                'id' => $form_id,
                'title' => false,
                'data' => round(collect($farm_size)->avg(), 2),
                'kind' => 'NUM',
                'description' => 'Acres is the avarage farm size',
                'width' => 12,
            ]],
            'kind' => 'CARDS',
            'description' => false,
            'width' => 12,
        ]];

        $hhprofile = [[
                'id' => $form_id,
                'title' => "Gender",
                'data' => Utils::getValues($form_id, 'hh_gender_farmer'),
                'kind' => 'PIE',
                'description' => false,
                'width' => 6
            ],[
                'id' => $form_id,
                'title' => "Household Size",
                'data' => $household->countBy()->map(function($d, $k){ 
                    return ['name' => $k, 'value' => $d]; 
                })->values(),
                'kind' => 'HORIZONTAL BAR',
                'description' => false,
                'width' => 6
            ],[
                'id' => $form_id,
                'data' => [[
                    'id' => $form_id,
                    'title' => false,
                    'data' => round($household->avg(), 2),
                    'kind' => 'NUM',
                    'description' => 'Acres is the avarage farm size',
                    'width' => 12,
                ]],
                'kind' => 'CARDS',
                'description' => false,
                'width' => 12,
        ]];

        $age = Utils::getValues($form_id, 'hh_age_farmer', false);
        $genderAge = Utils::mergeValues($age, 'hh_gender_farmer');
        $landownership = Utils::getValues($form_id, 'f_ownership');
        $owned_land = collect($landownership)->where('name','I Own All The Land')->first();
        $owned_land = round(($owned_land['value'] / $total) * 100, 0);
        $farmerprofile = [[
                'id' => $form_id,
                'title' => 'Age of Farmer',
                'data' => $genderAge,
                'kind' => 'HISTOGRAM',
                'description' => false,
                'width' => 12,
            ],[
                'id' => $form_id,
                'title' => "Farmers' land ownership status",
                'data' => $landownership,
                'kind' => 'BAR',
                'description' => false,
                'width' => 12,
        ]];

        $crops = Utils::getValues($form_id, 'f_crops');
        $producedcrops = Utils::getValues($form_id, 'f_produced (kilograms)', false);
        $producedcrops = Utils::mergeValues($producedcrops, 'f_crops', 100);
        $sdmcrops = Utils::getValues($form_id, 'f_sdm_size (acre)', false);
        $sdmcrops = Utils::mergeValues($sdmcrops, 'f_crops', 0.5);
        $soldcrops = Utils::getValues($form_id, 'f_sold (kilograms)', false);
        $soldcrops = Utils::mergeValues($soldcrops, 'f_crops', 100);
        $farmpractices = [[
                'id' => $form_id,
                'title' => 'Age of Farmer',
                'data' => $crops,
                'kind' => 'HORIZONTAL BAR',
                'description' => false,
                'width' => 12,
            ],[
                'id' => $form_id,
                'title' => "Produced Crops (Kilograms)",
                'data' => $producedcrops,
                'kind' => 'HISTOGRAM',
                'description' => false,
                'width' => 12,
            ],[
                'id' => $form_id,
                'title' => "SDM Size (Acre)",
                'data' => $sdmcrops,
                'kind' => 'HISTOGRAM',
                'description' => false,
                'width' => 12,
            ],[
                'id' => $form_id,
                'title' => "Sold Crops (Kilograms)",
                'data' => $soldcrops,
                'kind' => 'HISTOGRAM',
                'description' => false,
                'width' => 12,
            ],[
                'id' => $form_id,
                'title' => "Livestock",
                'data' => collect(Utils::getValues($form_id, 'f_livestock'))->reject(function($data){
                    return Str::contains($data['name'],"No");
                })->values(),
                'kind' => 'BAR',
                'description' => false,
                'width' => 12,
        ]];

        return [[
            'name' => 'overview',
            'charts' => $overview,
            ],[
            'name' => 'hh_profile',
            'charts' => $hhprofile,
            ],[
            'name' => 'farmer_profile',
            'charts' => $farmerprofile,
            ],[
            'name' => 'farm_practices',
            'charts' => $farmpractices,
        ]];
    }

}
