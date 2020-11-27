<?php

namespace App\Models;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class QuestionnairesCast implements CastsAttributes
{
    public function get($model, $key, $values, $attributes)
    {
        $arrays = json_decode($values) ?: [];
        $qs = new Questionnaires();

        foreach ($arrays as $name) {
            if (! array_key_exists($name, config('bc.questionnaires'))) {
                continue;
            }
            $qs[] = Questionnaire::get($name);
        }

        return $qs;
    }

    public function set($model, $key, $values, $attributes)
    {
        if (! $values instanceof Questionnaires) {
            return [];
        }

        $names = [];
        foreach ($values as $value) {
            $names[] = $value->name;
        }

        return json_encode($names);
    }
}
