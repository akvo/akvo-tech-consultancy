<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $table = 'questions';
    protected $hidden = ['created_at', 'updated_at'];

    public function data() {
        return $this->hasMany('App\Data', 'question_id', 'question_id');
    } 

    public function options() {
        return $this->hasMany('App\Option', 'question_id', 'question_id');
    } 

    public function forms() {
        return $this->belongsTo('App\Form', 'form_id', 'form_id');
    }
    
}
