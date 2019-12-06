<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SurveyGroup extends Model
{
    protected $table = 'survey_groups';
    protected $hidden = ['created_at'];

    public function questions() {
        return $this->hasMany('App\Question');
    }

    public function forms() {
        return $this->hasMany('App\Form');
    }
    
}
