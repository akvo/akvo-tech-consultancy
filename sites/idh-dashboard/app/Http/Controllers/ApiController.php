<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Illuminate\Support\Arr;
use App\Models\Form;
use App\Models\Variable;
use App\Models\Option;
use App\Models\Answer;
use App\Models\FormInstance;
use App\Helpers\Utils;
use App\Helpers\Cards;
use Carbon\Carbon;

class ApiController extends Controller
{
    public function filters(Form $form)
    {
        $data = $form->withCount('formInstances as total')->get()->groupBy('country');
        $data = collect($data)->map(function($list, $key){
            $list = $list->map(function ($item) {
                $date = Utils::getLastSubmissionDate($item['id']);
                $item['submission'] = Carbon::parse($date)->format('M Y');
                return $item;
            });
            return [
                'name' => $key,
                'childrens' => $list->makeHidden('country')
            ];
        })->values();
        return $data;
    }

    public function compareData(Request $request)
    {
        $id = (int) $request->id;
        $form = Form::where('id',$id)
                       ->withCount('formInstances')
                       ->first();
        $total = $form->form_instances_count;
        $first_crop = Utils::getValues($id, 'f_first_crop');
        $first_crop = Utils::getMax($first_crop);
        $second_crop = Utils::getValues($id, 'f_second_crop');
        $dedicated = collect($second_crop)
            ->where('name', "No Second Crop")
            ->values()
            ->first();
        $no_second_crop = round((1 - $dedicated['value'] / $total) * 100, 0);
        $farm_size = Utils::getValues($id, 'f_size (acre)');
        $second_crop = Utils::getValues($id,'f_second_crop');
        $landownership = Utils::getValues($id, 'f_ownership');
        $owned_land = collect($landownership)->where('name','I Own All The Land')->first();
        $owned_land = round(($owned_land['value'] / $total) * 100, 0);
        $maps = [
            'records' => Utils::getValues($id, 'pi_location_cascade_county'),
            'maps' => strtolower($form->country)
        ];
        $main_percentage = round($first_crop['value']/ $total, 2) * 100;
        $farm_size_avg = round(collect($farm_size)->avg(), 2);
        // $firstSubcards = [
        //     Cards::create($total, 'NUM', "Of the farmers are included in the analysis"),
        //     Cards::create($main_percentage, 'PERCENT', "Of the farmers main crop was ".$first_crop['name']),
        //     Cards::create($farm_size_avg, 'NUM', "Acres is the average farm size")
        // ];
        $livestock = collect(Utils::getValues($id, 'f_livestock'))->reject(function($data){
            return Str::contains($data['name'], "No");
        })->values();
        // $secondSubcards = [
        //     Cards::create($no_second_crop, 'PERCENT', "Of the farmers had more than one crop"),
        //     Cards::create($owned_land, 'PERCENT', "Of the farmers own the land they use to grow crops"),
        // ];
        // return [
        //     Cards::create($maps, 'MAPS', "Household Surveyed", 6),
        //     Cards::create(Utils::getValues($id, 'farmer_sample'), 'PIE', "Was the farmer surveyed part of the sample?", 4),
        //     Cards::create($firstSubcards, 'CARDS', false, 2),
        //     Cards::create($secondSubcards, 'CARDS', false, 2),
        //     Cards::create($landownership, 'BAR', "Farmers' land ownership status", 5),
        //     Cards::create($livestock, 'BAR', "Livestock' land ownership status", 5),
        // ];
        return [
            Cards::create($maps, 'MAPS', "Household Surveyed", 4, false, 1),
            Cards::create(Utils::getValues($id, 'farmer_sample'), 'PIE', "Was the farmer surveyed part of the sample?", 4, false, 2),
            
            Cards::create($total, 'NUM', "Of the farmers are included in the analysis", 4, false, 3),
            // Cards::create($main_percentage, 'PERCENT', "Of the farmers main crop was ".$first_crop['name'], 4, false, 4),
            Cards::create($farm_size_avg, 'NUM', "Acres is the average farm size", 4, false, 5),

            Cards::create($no_second_crop, 'PERCENT', "Of the farmers had more than one crop", 4, false, 6),
            Cards::create($owned_land, 'PERCENT', "Of the farmers own the land they use to grow crops", 4, false, 7),

            Cards::create($landownership, 'BAR', "Farmers' land ownership status", 4, false, 8),
            Cards::create($livestock, 'BAR', "Livestock' land ownership status", 4, false, 9),
        ];
    }

    public function countryData(Request $request) {
        $id = (int) $request->id;
        $form = Form::where('id',$id)
                       ->withCount('formInstances')
                       ->first();
        $total = $form->form_instances_count;
        // $household = Utils::getValues($id, 'hh_size');

        if ($request->tab === "resources") {
            return [
                'summary' => [$total, $form->kind, $form->country, $form->company],
                'tabs' => []
            ];
        }

        if ($request->tab === "overview") {
            $submission = Utils::getLastSubmissionDate($id);
            $submission_month = Carbon::now()->format('m') - Carbon::parse($submission)->format('m');

            $farm_size = Utils::getValues($id, 'f_size (acre)');

            $maps = [
                'records' => Utils::getValues($id, 'pi_location_cascade_county'),
                'maps' => strtolower($form->country)
            ];

            $first_crop = collect(Utils::getValues($id, 'f_first_crop'));
            $first_crop_total = $first_crop->pluck('value')->sum();
            $first_crop_value = $first_crop->max('value');
            $first_crop_name = $first_crop->where('value', $first_crop_value)->first()['name'];

            $overview = [
                // Cards::create(Utils::getValues($id, 'f_first_crop'), 'BAR', "Farmer First Crop"),
                Cards::create([
                    Cards::create($submission_month.' month ago', 'MONTH', 'In '.Carbon::parse($submission)->format('M Y'), 12, 'Survey conducted')
                ], 'CARDS', false, 6),
                Cards::create([
                    Cards::create(strval(round($first_crop_value/$first_crop_total, 2)*100).'%', 'NUM', 'Of the farmers’ main crop was '.$first_crop_name)
                ], 'CARDS', false, 6),
                Cards::create($maps, 'MAPS', "Household Surveyed", 6),
                Cards::create(Utils::getValues($id, 'farmer_sample'), 'PIE', "The farmer surveyed part of the sample", 6),
                // Cards::create([
                //     Cards::create(round(collect($farm_size)->avg(), 2), 'NUM', 'Acres is the average farm size')
                // ], 'CARDS', false),
            ];
            return [
                'summary' => [$total, $form->kind, $form->country, $form->company],
                'tabs' => [[
                    'name' => 'overview',
                    'charts' => $overview,
                ]]
            ];
        }

        if ($request->tab === "hh-profile") {
            /*
            $variableLevels = collect([
                ['name' => 'f_first_crop','level' => 1],
                ['name' => 'f_ownership','level' => 2],
                ['name' => 'f_sdm_size (acre)','level' => 3],
            ]);
            $hhSankeyVar = Variable::whereIn('name', $variableLevels->pluck('name')->flatten())
                ->get()->pluck('id');
            $hhData = FormInstance::where('form_id', $id)->with(['answers' => function($q) use ($hhSankeyVar) {
                $q->whereIn('variable_id', $hhSankeyVar)->with(['variable','option']);
            }])->get()->pluck('answers')->flatten(1);
            $hhData = collect($hhData)
                ->map(function($q) use ($hhData, $variableLevels) {
                    $d = $q->makeHidden(['option','variable']);
                    $lv = $variableLevels->where('name', $q['variable']['name'])->values()->first();
                    $d['level'] = $lv['level'];
                    $d['option_name'] = null;
                    if ($q['option'] !== null) {
                        $d['value']= $q['option']['option_id'];
                        $d['option_name'] = Option::where('id', $d['value'])->first()->name;
                    }
                    return $d;
            })->groupBy('form_instance_id')->values();
            $hhData = $hhData->map(function($instances) use ($variableLevels){
                $value = count($variableLevels);
                $instances = $instances->sortBy('level')->values();
                return $instances;
            });
            return $hhData;
             */

            $household = Utils::getValues($id, 'hh_size');

            $hhGenderAvg = Utils::getAvg($id, 'hh_gender_farmer', 'hh_size');

            $head_gender = Utils::getValues($id, 'hh_head_gender', false, true, false);
            $head_gender_tmp = [
                "columns" => [
                    [
                        "name" => "",
                        "selector" => "name",
                        "sortable" => true,
                    ],
                    [
                        "name" => "Male operated farm",
                        "selector" => "male",
                        "sortable" => true,
                    ],
                    [
                        "name" => "Female operated farm",
                        "selector" => "female",
                        "sortable" => true,
                    ]
                ]
            ];
            $head_gender_tmp["rows"] = $head_gender->map(function ($item) {
                return [
                    "name" => strtolower($item['name']) === 'male' ? 'Male headed household' : 'Female headed household',
                    "male" => $item['gender']->where('name', 'Male')->first()['value'], 
                    "female" => $item['gender']->where('name', 'Female')->first()['value'], 
                ];
            });

            $shortage_months = Utils::getValues($id, 'fs_shortage_months', false, true); // by gender

            $hhsize_male = Utils::getValues($id, 'hh_size_male')->sum();
            $hhsize_female = Utils::getValues($id, 'hh_size_female')->sum();
            $hh_gender_composition = [
                [
                    "name" => "Male",
                    "value" => $hhsize_male,
                ],
                [
                    "name" => "Female",
                    "value" => $hhsize_female,
                ],
            ];

            // $hhSize = $household->countBy()
            //                     ->map(function($d, $k){return ['name' => $k, 'value' => $d];})
            //                     ->values();

            $hhProfile = collect([
                Cards::create(
                    [Cards::create($household->median(), 'NUM', 'Median household size')]
                    , 'CARDS', false, 6
                ),
                Cards::create(
                    [Cards::create(2, 'NUM', 'Female household members that work on the farm')]
                    , 'CARDS', false, 6
                ),
                Cards::create(Utils::getValues($id, 'hh_gender_farmer'), 'PIE', "Gender", 6),
                Cards::create($hh_gender_composition, 'PIE', "Household gender composition", 6),
                Cards::create([$head_gender_tmp], 'TABLE', "Gender roles in the household and on the farm", 12),
                Cards::create($shortage_months, 'BAR', "Months of food insecurity disaggregated by gender", 12),
                // Cards::create($hhSize, 'UNSORTED HORIZONTAL BAR', "Household Size", 6)
            ]);
            // $hhGenderAvg->each(function($avg) use ($hhGenderAvg, $hhProfile){
            //     $title = " is the average of HH size (" . Str::title($avg['name']) . ")"; 
            //     $colSize = 6 / count($hhGenderAvg);
            //     $hhProfile->push(
            //         Cards::create(
            //             [Cards::create($avg['value'], 'NUM', $title)],
            //             'CARDS', false, $colSize
            //         )
            //     );
            // });
            // $hhProfile->push(
            //     Cards::create(
            //         [Cards::create(round($household->avg(),2), 'NUM', 'is the average HH Size')]
            //         , 'CARDS', false, 6
            //     )
            // );
            return [
                'summary' => [$total, $form->kind, $form->country, $form->company],
                'tabs' => [[
                    'name' => 'hh_profile',
                    'charts' => $hhProfile,
                ]]
            ];
        }

        if ($request->tab === "farmer-profile") {            
            $age = Utils::getValues($id, 'hh_age_farmer', false);
            $genderAge = Utils::mergeValues($age, 'hh_gender_farmer');
            // $landownership = Utils::getValues($id, 'f_ownership');
            // $owned_land = collect($landownership)->where('name','I Own All The Land')->first();
            // $owned_land = round(($owned_land['value'] / $total) * 100, 0);
            $farmerProfile = [
                // Cards::create(Utils::getValues($id, 'hh_education_farmer'), 'BAR', 'Education Level', 6),
                // Cards::create($landownership, 'BAR', "Farmers' land ownership status", 6),
                Cards::create(Utils::getValues($id, 'hh_gender_farmer'), 'PIE', "Gender", 6),
                Cards::create($genderAge, 'HISTOGRAM', 'Age of Farmer', 6),
                Cards::create(Utils::getValues($id, 'hh_education_farmer', false, true), 'BAR', 'Education Level by Gender (%)', 6),
                Cards::create(Utils::getValues($id, 'f_ownership', false, true), 'BAR', "Farmers' land ownership status by Gender (%)", 6),
            ];
            return [
                'summary' => [$total, $form->kind, $form->country, $form->company],
                'tabs' => [[
                    'name' => 'farmer_profile',
                    'charts' => $farmerProfile,
                ]]
            ];
        }

        if ($request->tab === "farm-practices") {
            $f_harvests = Utils::getValues($id, 'f_harvests');
            
            $f_lost_kg = Utils::getValues($id, 'f_lost (kilograms)', false);
            $lost_kg = Utils::mergeValues($f_lost_kg, 'f_first_crop', strtolower($form->kind));

            $income_by_third_crop = collect(Utils::mergeValues(Utils::getValues($id, 'f_other_crop_income', false), 'f_third_crop'));
            $income_by_third_crop['data'] = Utils::setPercentMergeValue($income_by_third_crop['data'], 3);

            $input_usage = Utils::getValues($id, 'f_inputs_usage');
            $input_usage = Utils::setPercentValue($input_usage);

            $equipment_usage = Utils::getValues($id, 'f_equipment_usage');
            $equipment_usage = Utils::setPercentValue($equipment_usage);

            // $crops = Utils::getValues($id, 'f_crops');
            // $producedCrops = Utils::getValues($id, 'f_produced (kilograms)', false);
            // $fsdmId = Variable::where('name', 'f_sdm_size (acre)')->first();
            // $producedCrops = $producedCrops->map(function($p) use ($fsdmId){
            //     $fsdmVal = Answer::where('form_instance_id', $p['form_instance_id'])
            //         ->where('variable_id', $fsdmId->id)->first()->value;
            //         return [
            //             'id' => $p->id,
            //             'form_instance_id' => $p->form_instance_id,
            //         'variable_id' => $p->variable_id,
            //         'form_id' => $p->form_id,
            //         'value' => $fsdmVal > 0 ? $p->value / $fsdmVal : 0,
            //     ];
            // });
            // $producedCrops = Utils::mergeValues($producedCrops, 'f_first_crop', strtolower($form->kind));
            // $soldCrops = Utils::getValues($id, 'f_sold (kilograms)', false);
            // $soldCrops = Utils::mergeValues($soldCrops, 'f_first_crop', strtolower($form->kind));
            // $avgProducedCrops = $producedCrops['data'][0]['avg'];
            // $avgSoldCrops = $soldCrops['data'][0]['avg'];
            // $livestock = collect(Utils::getValues($id, 'f_livestock'))->reject(function($data){
            //         return Str::contains($data['name'],"No"); 
            // })->values();

            $farmpractices = [
                // Cards::create($crops, 'BAR', 'Crops'),
                // Cards::create($producedCrops, 'HISTOGRAM', 'Productivity (Kilograms / Acre)', 6),
                // Cards::create($soldCrops, 'HISTOGRAM', 'Sold Crops (Kilograms)'),
                // Cards::create([Cards::create($avgProducedCrops, 'NUM', 'is the average Productivity')], 'CARDS',false, 6),
                // Cards::create([Cards::create($avgSoldCrops, 'NUM', 'is the average Sold Crops')], 'CARDS',false, 6),
                // Cards::create($livestock, 'BAR','Livestock'),
                Cards::create([Cards::create($f_harvests->median(), 'NUM', 'Median number of harvests')], 'CARDS',false, 12),
                Cards::create($lost_kg, 'HISTOGRAM', 'Crop loss (kilograms) - focus crop', 6),
                Cards::create($income_by_third_crop['data'], 'BAR', 'Third highest income crop - other (%)', 6),
                Cards::create($input_usage, 'BAR', 'Inputs - Type (%)', 6),
                Cards::create($equipment_usage, 'BAR', 'Equipment used (%)', 6),
            ];
            return [
                'summary' => [$total, $form->kind, $form->country, $form->company],
                'tabs' => [[
                    'name' => 'farm_practices',
                    'charts' => $farmpractices
                ]]
            ];
        }

        if ($request->tab === "farm-characteristics") {
            $farm_size = Utils::getValues($id, 'f_size (acre)');
            
            $fsdmId = Variable::where('name', 'f_sdm_size (acre)')->first();
            $farm_sizes = Utils::getValues($id, 'f_size (acre)', false)->map(function ($item) use ($fsdmId) {
                $fsdmVal = Answer::where('form_instance_id', $item['form_instance_id'])
                    ->where('variable_id', $fsdmId->id)->first()->value;
                return [
                    'id' => $item->id,
                    'form_instance_id' => $item->form_instance_id,
                    'variable_id' => $item->variable_id,
                    'form_id' => $item->form_id,
                    'value' => $fsdmVal + $item->value,
                ];
            });
            $farm_sizes = collect(Utils::mergeValues($farm_sizes, 'f_first_crop'));
            $total_farm_sizes = $farm_sizes['data']->max('total');
            $only_farm_sizes = $farm_sizes['data']->where('name', strtolower($form->kind))->first();
            
            $second_crop = collect(Utils::getValues($id, 'f_second_crop'));
            $total_second_crop = $second_crop->reject(function ($item) {
                return strtolower($item['name']) === strtolower("No Second Crop");
            })->pluck('value')->sum();

            $livestock = collect(Utils::getValues($id, 'f_livestock'))->reject(function($data){
                return Str::contains($data['name'],"No"); 
            })->values();
            $livestock = Utils::setPercentValue($livestock);
            $max_livestock = $livestock->sortByDesc('value')->values()->first();
            
            $crops = collect(Utils::getValues($id, 'f_crops'))->reject(function ($item) {
                return $item['value'] < 10;
            })->values();
            $crops = Utils::setPercentValue($crops);
            $crop_names = $crops->pluck('name');
            $crops_text = join(', ', $crop_names->toArray());

            $type = Utils::getValues($id, 'f_type');
            $max_type['name'] = "...";
            $type_percent = 0;
            if ($type->count() > 0) {
                $max_type = $type->sortByDesc('value')->values()->first();
                $type_percent = round(($max_type['value']/$type->pluck('value')->sum())*100, 2);
            }

            $farmcharacteristics = [
                Cards::create([
                    Cards::create(round(collect($farm_size)->avg(), 2), 'NUM', 'Acres is the average farm size')
                ], 'CARDS', false, 3),
                Cards::create([
                    Cards::create(round($only_farm_sizes['total']/$total_farm_sizes, 2)*100, 'PERCENT', 'Of the farm is on average dedicated to '.$only_farm_sizes['name'])
                ], 'CARDS', false, 3),
                Cards::create([
                    Cards::create(round($total_second_crop/$total, 2)*100, 'PERCENT', 'Of the farmers had more than one crop')
                ], 'CARDS', false, 3),
                Cards::create([
                    Cards::create(round($livestock->pluck('value')->sum()/$total, 2)*100, 'PERCENT', 'Of the farmers have livestock')
                ], 'CARDS', false, 3),
                Cards::create($type, 'PIE', $type_percent.'% of the farmers grow '.$max_type['name'].' '.$form->kind, 6),
                Cards::create($crops, 'BAR', $crops_text.' are the most grow crops by the surveyed farmers', 6),
                Cards::create($livestock, 'BAR','Of the farmers that own livestock the largest part own '.$max_livestock['name'].': '.$max_livestock['value'].'%'),
            ];

            return [
                'summary' => [$total, $form->kind, $form->country, $form->company],
                'tabs' => [[
                    'name' => 'farm_characteristics',
                    'charts' => $farmcharacteristics
                ]]
            ];
        }

        if ($request->tab === "gender") {
            $female = Utils::getValues($id, 'hh_size_female', false);
            $education_female = Utils::mergeValues($female, 'g_education');
            $education_female['data'] = Utils::setPercentMergeValue($education_female['data']);

            $reprod_activities = Utils::getValues($id, 'g_reprod_activities');
            $reprod_activities =  Utils::setPercentValue($reprod_activities);

            $genders = [
                Cards::create($education_female['data'], 'BAR', 'Education of female head of HH (%)', 6),
                Cards::create($reprod_activities, 'BAR', 'Participation in reproductive activities (%)', 6),
            ];

            return [
                'summary' => [$total, $form->kind, $form->country, $form->company],
                'tabs' => [[
                    'name' => 'gender',
                    'charts' => $genders
                ]]
            ];
        }
    
    }

}
