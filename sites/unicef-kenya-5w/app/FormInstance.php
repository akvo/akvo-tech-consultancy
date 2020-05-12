<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class FormInstance extends Model
{
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = ['form_id', 'data_point_id', 'identifier', 'submitter', 'device', 'submission_date', 'survey_time'];

    public function dataPoint()
    {
        return $this->belongsTo('App\DataPoint');
    }

    public function form()
    {
        return $this->belongsTo('App\Form');
    }

    public function answers()
    {
        return $this->hasMany('App\Answer');
    }
}
