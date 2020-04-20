<?php

namespace App\Http;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class AkvoFlow extends Http
{
    public function getForm($instance_name, $form_id)
    {
        $form = Str::of(config('akvoflow.form_api'))
            ->replace('#instance_name',$instance_name)
            ->replace('#form_id',$form_id);
        $form = Http::get($form)->json();
        return $form;
    }

    public function getCascade($cascade_id, $level)
    {
        $cascade = Str::of(config('akvoflow.cascade_api'))
            ->replace('#cascade', $cascade_id)
            ->replace('#level', $level);
        $cascade = Http::get($cascade)->json();
        return $cascade;
    }
}
