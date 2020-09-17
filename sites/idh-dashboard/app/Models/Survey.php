<?php

namespace App\Models;

use Akvo\Models\Survey as AkvoSurvey;
use Illuminate\Support\Str;

class Survey extends AkvoSurvey
{

    protected $hidden = [
        'id',
        'created_at',
        'updated_at',
        'registration_id',
        'path',
    ];

    protected $appends = [
        'country'
    ];

    public function childrens() {
        return $this->hasManyThrough('App\Models\QuestionGroup', 'Akvo\Models\Form');
    }

    public function questions() {
        return $this->hasManyThrough('App\Models\Question','Akvo\Models\Form');
    }

    public function fsize() {
        $farm_size = \Akvo\Models\Variable::where('name','F_size')->first();
        return $this->questions()->where('variable_id',$farm_size->id);
    }

    public function getCountryAttribute() {
        $path = Str::lower($this->path);
        $countries = ['kenya','vietnam', 'uganda','rwanda','nigeria'];
        foreach($countries as $country) {
            $path = Str::contains(Str::lower($path), $country) ? $country : $path;
        }
        return Str::title($path);
    }

}
