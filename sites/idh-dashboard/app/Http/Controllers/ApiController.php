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
use App\Helpers\Cards;

class ApiController extends Controller
{

    public function login(Request $request)
    {
        $loginData = $request->validate([
            'email' => 'email|required',
            'password' => 'required'
        ]);

        if (!auth()->attempt($loginData)) {
            return response(['message' => 'Invalid Credentials']);
        }

        $accessToken = auth()->user()->createToken('authToken')->accessToken;
        return response(['user' => auth()->user(), 'access_token' => $accessToken]);

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
        $firstSubcards = [
            Cards::create($total, 'NUM', "Of the farmers are included in the analysis"),
            Cards::create($main_percentage, 'PERCENT', "Of the farmers main crop was ".$first_crop['name']),
            Cards::create($farm_size_avg, 'NUM', "Acres is the average farm size")
        ];
        $livestock = collect(Utils::getValues($id, 'f_livestock'))->reject(function($data){
            return Str::contains($data['name'], "No");
        })->values();
        $secondSubcards = [
            Cards::create($no_second_crop, 'PERCENT', "Of the farmers had more than one crop"),
            Cards::create($owned_land, 'PERCENT', "Of the farmers own the land they use to grow crops"),
        ];
        return [
            Cards::create($maps, 'MAPS', "Household Surveyed", 6),
            Cards::create(Utils::getValues($id, 'farmer_sample'), 'PIE', "Was the farmer surveyed part of the sample?", 4),
            Cards::create($firstSubcards, 'CARDS', false, 2),
            Cards::create($secondSubcards, 'CARDS', false, 2),
            Cards::create($landownership, 'BAR', "Farmers' land ownership status", 5),
            Cards::create($livestock, 'BAR', "Livestock' land ownership status", 5),
        ];
    }

    public function countryData(Request $request) {
        $id = (int) $request->id;
        $form = Form::where('id',$id)
                       ->withCount('formInstances')
                       ->first();
        $total = $form->form_instances_count;
        $household = Utils::getValues($id, 'hh_size');

        if ($request->tab === "resources") {
            return [
                'summary' => [$total, $form->kind, $form->country, $form->company],
                'tabs' => []
            ];
        }

        if ($request->tab === "overview") {
            $farm_size = Utils::getValues($id, 'f_size (acre)');
            $maps = [
                'records' => Utils::getValues($id, 'pi_location_cascade_county'),
                'maps' => strtolower($form->country)
            ];
            $overview = [
                Cards::create($maps, 'MAPS', "Household Surveyed", 6),
                Cards::create(Utils::getValues($id, 'farmer_sample'), 'PIE', "The farmer surveyed part of the sample", 6),
                Cards::create(Utils::getValues($id, 'f_first_crop'), 'BAR', "Farmer First Crop"),
                Cards::create([
                    Cards::create(round(collect($farm_size)->avg(), 2), 'NUM', 'Acres is the average farm size')
                ], 'CARDS', false),
            ];
            return [
                'summary' => [$total, $form->kind, $form->country, $form->company],
                'tabs' => [[
                    'name' => 'overview',
                    'charts' => $overview,
                ]]
            ];
        }

        if ($request->tab === "hh_profile") {
            $hhGenderAvg = Utils::getAvg($id, 'hh_gender_farmer', 'hh_size');
            $hhSize = $household->countBy()
                                ->map(function($d, $k){return ['name' => $k, 'value' => $d];})
                                ->values();
            $hhProfile = collect([
                Cards::create(Utils::getValues($id, 'hh_gender_farmer'), 'PIE', "Gender", 6),
                Cards::create($hhSize, 'UNSORTED HORIZONTAL BAR', "Household Size", 6)
            ]);
            $hhGenderAvg->each(function($avg) use ($hhGenderAvg, $hhProfile){
                $title = " is the average of HH size (" . Str::title($avg['name']) . ")";
                $colSize = 6 / count($hhGenderAvg);
                $hhProfile->push(
                    Cards::create(
                        [Cards::create($avg['value'], 'NUM', $title)],
                        'CARDS', false, $colSize
                    )
                );
            });
            $hhProfile->push(
                Cards::create(
                    [Cards::create(round($household->avg(),2), 'NUM', 'is the average HH Size')]
                    , 'CARDS', false, 6
                )
            );
            return [
                'summary' => [$total, $form->kind, $form->country, $form->company],
                'tabs' => [[
                    'name' => 'hh_profile',
                    'charts' => $hhProfile,
                ]]
            ];
        }

        if ($request->tab === "farmer_profile") {
            $age = Utils::getValues($id, 'hh_age_farmer', false);
            $genderAge = Utils::mergeValues($age, 'hh_gender_farmer');
            $landownership = Utils::getValues($id, 'f_ownership');
            $owned_land = collect($landownership)->where('name','I Own All The Land')->first();
            $owned_land = round(($owned_land['value'] / $total) * 100, 0);
            $farmerProfile = [
                Cards::create($genderAge, 'HISTOGRAM', 'Age of Farmer'),
                Cards::create(Utils::getValues($id, 'hh_education_farmer'), 'BAR', 'Education Level'),
                Cards::create($landownership, 'BAR', "Farmers' land ownership status"),
            ];
            return [
                'summary' => [$total, $form->kind, $form->country, $form->company],
                'tabs' => [[
                    'name' => 'farmer_profile',
                    'charts' => $farmerProfile,
                ]]
            ];
        }

        if ($request->tab === "farm_practices") {
            $crops = Utils::getValues($id, 'f_crops');
            $producedCrops = Utils::getValues($id, 'f_produced (kilograms)', false);
            $fsdmId = Variable::where('name', 'f_sdm_size (acre)')->first();
            $producedCrops = $producedCrops->map(function($p) use ($fsdmId){
                $fsdmVal = Answer::where('form_instance_id', $p['form_instance_id'])
                    ->where('variable_id', $fsdmId->id)->first()->value;
                return [
                    'id' => $p->id,
                    'form_instance_id' => $p->form_instance_id,
                    'variable_id' => $p->variable_id,
                    'form_id' => $p->form_id,
                    'value' => $fsdmVal > 0 ? $p->value / $fsdmVal : 0,
                ];
            });
            $producedCrops = Utils::mergeValues($producedCrops, 'f_first_crop', strtolower($form->kind));
            $soldCrops = Utils::getValues($id, 'f_sold (kilograms)', false);
            $soldCrops = Utils::mergeValues($soldCrops, 'f_first_crop', strtolower($form->kind));
            $avgProducedCrops = $producedCrops['data'][0]['avg'];
            $avgSoldCrops = $soldCrops['data'][0]['avg'];
            $livestock = collect(Utils::getValues($id, 'f_livestock'))->reject(function($data){
                    return Str::contains($data['name'],"No"); 
            })->values();
            $farmpractices = [
                Cards::create($crops, 'BAR', 'Crops'),
                Cards::create($producedCrops, 'HISTOGRAM', 'Productivity (Kilograms / Acre)'),
                Cards::create($soldCrops, 'HISTOGRAM', 'Sold Crops (Kilograms)'),
                Cards::create([Cards::create($avgProducedCrops, 'NUM', 'is the average Productivity')], 'CARDS',false, 6),
                Cards::create([Cards::create($avgSoldCrops, 'NUM', 'is the average Sold Crops')], 'CARDS',false, 6),
                Cards::create($livestock, 'BAR','Livestock'),
            ];
            return [
                'summary' => [$total, $form->kind, $form->country, $form->company],
                'tabs' => [[
                    'name' => 'farm_practices',
                    'charts' => $farmpractices
                ]]
            ];
        }

    }

}
