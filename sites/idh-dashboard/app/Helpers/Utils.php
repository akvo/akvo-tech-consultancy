<?php

namespace App\Helpers;

use Illuminate\Support\Collection;
use App\Models\Form;
use App\Models\FormInstance;
use App\Models\Option;
use App\Models\Variable;
use App\Models\Answer;

class Utils {

    public static function getValues($form_id, $variable_name)
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
        return $data->pluck('value');
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
        }
        return $answers->get();
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

}
