<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Datapoint extends Model
{
    protected $hidden = ['created_at','updated_at'];
    protected $fillable = ['form_id','survey_group_id','form_id','partnership_id','country_id','submission_date','datapoint_id'];

	public function answers() 
	{
		return $this->hasMany('App\Answer');
	}

    public function forms()
    {
        return $this->belongsTo('\App\Form','form_id','form_id');
    } 

    public function surveygroup() 
	{
        return $this->belongsTo('App\SurveyGroup');
    }

    public function partnership()
    {
        return $this->hasOne('App\Partnership', 'id', 'partnership_id');
    }

    public function country()
    {
        return $this->hasOne('App\Partnership', 'id', 'country_id');
    }

}
