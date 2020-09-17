<?php

namespace App\Models;

use Akvo\Models\QuestionGroup as AkvoQuestionGroup;

class QuestionGroup extends AkvoQuestionGroup
{

    protected $hidden = ['repeat','created_at','updated_at','form_id','id'];

    public function questions() {
        return $this->hasMany('App\Models\Question');
    }

    public function childrens() {
        return $this->questions()
                    ->whereNotNull('variable_id')
                    ->whereIn('type', ['option','numeric']);
    }

}
