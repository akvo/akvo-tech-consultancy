<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Form extends Model
{
    protected $table = 'forms';

    public function data() {
        return $this->hasMany('App\Question', 'form_id', 'form_id');
    } 
    
}
