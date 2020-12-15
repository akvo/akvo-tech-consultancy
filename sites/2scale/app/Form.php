<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Form extends Model
{
    protected $table = 'forms';
    protected $hidden = ['created_at'];
    protected $fillable = ['form_id','survey_id','name','partner_qid','org_qid'];

    public function surveygroup() {
        return $this->belongsTo('App\SurveyGroup');
    }

    public function questions() {
        return $this->hasMany('App\Question', 'form_id', 'form_id');
    }

    public function data() {
        return $this->hasMany('App\Data', 'form_id', 'form_id');
    }
    
    public function datapoints()
    {
        return $this->hasMany('App\Datapoint', 'form_id', 'form_id');
    }

    public function questiongroups()
    {
        return $this->hasMany('App\QuestionGroup', 'form_id', 'form_id');
    }
}
