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

    public static function getAvg($form_id, $variable_name, $variable_count)
    {
        $var = Variable::where('name', $variable_name)->first();
        $cnt = Variable::where('name', $variable_count)->first();
        $answers = Answer::where('form_id', $form_id)
            ->whereIn('variable_id', [$var->id, $cnt->id])
            ->with('options.option')
            ->get()->groupBy('form_instance_id')->values();
        $answers = $answers->map(function($a) use ($var, $cnt) {
            $opt = $a->where('variable_id', $var->id)->first();
            $val = $a->where('variable_id', $cnt->id)->first();
            return [
                'name' => $opt->options->first()->option->name,
                'value' => $val->value,
            ];
        })->groupBy('name')->map(function($data, $key){
            return [
                'name' => $key,
                'value' => round($data->pluck('value')->avg(), 1)
            ];
        })->values();
        return $answers;
    }

    public static function getMax($data)
    {
        return collect($data)->sortByDesc('value')->first();
    }

    public static function getVarValue($form_id, $var)
    {
        $answers = Answer::where('form_id', $form_id)
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

    public static function mergeValues($values, $variable_name, $only=false) {
        $current = $values[0]['variable_id'];
        $current = Variable::where('id', $current)->first();
        $variable = Variable::where('name', $variable_name)->first();
        $values = $values->map(function($data) use ($current, $variable) {
            $option = Answer::where('form_instance_id', $data['form_instance_id'])
                ->where('variable_id', $variable->id)->with('options.option')->first();
            $option = $option->options->first()->option->name;
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
        $results = $values->map(function($data) {
            $value = $data['data']->groupBy('name')->map(function($d, $k){
                return [$k, $d->sum('value')];
            })->values();
            return [
                'name' => $data['name'],
                'data' => $value,
            ];
        });
        if (!$only) {
            $all = $values->pluck('data')->flatten(1);
            $all = $all->groupBy('name')->map(function($d, $k){
                return [$k, $d->sum('value')];
            })->values();
            $all = ['name' => 'all','data' => $all];
            $results->push($all);
        }
        $results = $only ? $results->where('name', $only) : $results;
        return ['data' => $results];
    }


}
