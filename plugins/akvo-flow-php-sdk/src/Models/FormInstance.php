<?php

namespace Akvo\Models;

use Illuminate\Database\Eloquent\Model;

class FormInstance extends Model
{
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = ['fid','form_id', 'data_point_id', 'identifier', 'submitter', 'device', 'submission_date', 'survey_time'];

    public function dataPoint()
    {
        return $this->belongsTo('Akvo\Models\DataPoint');
    }

    public function form()
    {
        return $this->belongsTo('Akvo\Models\Form');
    }

    public function answers()
    {
        return $this->hasMany('Akvo\Models\Answer');
    }
}
