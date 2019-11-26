<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Form extends Model
{
    protected $table = 'forms';
    protected $hidden = ['created_at', 'updated_at'];

    public function questions() {
        return $this->hasMany('App\Question', 'form_id', 'form_id');
    }

    public function data() {
        return $this->hasMany('App\Data', 'form_id', 'form_id');
    }
    
}
