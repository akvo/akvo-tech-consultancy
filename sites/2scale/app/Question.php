<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Question extends Model
{
    protected $table = 'questions';
    protected $hidden = ['created_at', 'updated_at'];
    protected $appends = ['short_text'];
    protected $fillable = ['question_id','datapoint_id','text','options','value'];

    public function getShortTextAttribute() {
        return Str::limit($this->text, 10,'...');
    }

    public function surveyGroups() {
        return $this->hasMany('App\SurveyGroup');
    }

    public function form() {
        return $this->belongsTo('App\Form', 'form_id', 'form_id');
    }
    public function data() {
        return $this->hasMany('App\Data', 'question_id', 'question_id');
    } 

    public function options() {
        return $this->hasMany('App\Option');
    } 

}
