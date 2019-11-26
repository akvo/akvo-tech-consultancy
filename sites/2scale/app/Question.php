<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Question extends Model
{
    protected $table = 'questions';
    protected $hidden = ['created_at', 'updated_at'];
    protected $appends = ['short_text'];

    public function getShortTextAttribute() {
        return Str::limit($this->text, 10,'...');
    }

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
