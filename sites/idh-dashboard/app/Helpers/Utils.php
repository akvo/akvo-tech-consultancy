<?php

namespace App\Helpers;

use Illuminate\Support\Collection;
use App\Models\Form;
use App\Models\FormInstance;
use App\Models\Option;
use App\Models\Variable;
use App\Models\Answer;

class Utils {


    public function getPercentage($data, $total, $variable)
    {
        $data = self::getMax($data);
        return [
            'value' => round($data['value'] / $total, 2) * 100,
            'desc' => 'Of the ' . strtolower($variable) . ' was '.$data['name'],
        ];
    }

    public static function getValues($form_id, $variable_name, $pluck=true)
    {
        $var = Variable::where('name',$variable_name)->first();
        $data = self::getVarValue($form_id, $var);
        if ($var->type === 'option') {
            $data = $data->pluck('options');
            $data= $data->flatten()
                        ->countBy('option_id')
                        ->transform(function($val, $key) {
                            return [
                                'name' => Option::where('id',$key)->first()->text,
                                'value' => $val
                            ];
                        })->values();
            return $data;
        }
        if ($pluck){
            return $data->pluck('value');
        }
        return $data;
    }

    public static function getMax($data)
    {
        return collect($data)->sortByDesc('value')->first();
    }

    public static function getVarValue($form_id, $var)
    {
        $formInstances = FormInstance::where('form_id', $form_id)->get('id');
        $formInstanceIds = $formInstances->pluck('id');
        $answers = Answer::whereIn('form_instance_id', $formInstanceIds)
            ->where('variable_id', $var->id);
        if ($var->type === 'option') {
            $answers = $answers->with('options');
            return $answers->get();
        }
        return $answers->whereNotNull('value')->get();
    }

    public static function completeVariables()
    {
        $variables = FormInstance::get()->unique('form_id')->values()->transform(function($data){
            return $data->answers;
        });
        $form_samples = count($variables);
        $variables = $variables->flatten(0)->groupBy('variable_id')->values();
        $variables = $variables->reject(function($data) use ($form_samples){
            return count($data) < $form_samples;
        })->values()->flatten(0)->unique('variable_id')->values()->pluck('variable_id');
        return Variable::whereIn('id',$variables)->get();
    }

    public static function mergeValues($values, $variable_name, $interval=1) {
        $current = $values[0]['variable_id'];
        $current = Variable::where('id', $current)->first();
        $variable = Variable::where('name', $variable_name)->first();
        $list = collect();
        $values = $values->map(function($data) use ($current, $variable, $list) {
            $option = Answer::where('form_instance_id', $data['form_instance_id'])
                ->where('variable_id', $variable->id)->with('options.option')->first();
            $option = $option->options->first()->option->name;
            $list->push($data['value']);
            return [
                $variable->name => $option,
                $current->name => $data['value'],
            ];
        })->groupBy($variable->name)->map(function($data, $key) use ($current){
            $value = $data->pluck($current->name)->countBy()->map(function($a, $k){
                return ['name' => $k, 'value'=> $a];
            })->sortByDesc('name')->values();
            return [
                'name' => $key,
                'data' => $value
            ];
        })->values();
        $values = $values->map(function($data) use ($list){
            $unlisted = collect();
            foreach($list as $l){
                $listed = collect($data['data'])->where('name', $l)->first();
                if ($listed){
                    $unlisted->push($listed);
                } else {
                    $unlisted->push(['name' => $l,'value' => 0]);
                }
            }
            return [
                'name' => $data['name'],
                'data' => $unlisted->pluck('value'),
            ];
        });
        return ['data' => $values, 'min' => 0, 'max' => count($list)];
    }


}
