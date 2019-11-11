<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $table = 'questions';

    public function data() {
        return $this->hasMany('App\Data', 'question_id', 'question_id');
    } 
    
}
