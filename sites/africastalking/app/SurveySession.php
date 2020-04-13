<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SurveySession extends Model
{
    protected $table = 'survey_sessions';
    protected $fillable = [
        'session_id',
        'instance_name',
        'form_id',
        'form_name',
        'version',
        'phone_number',
        'enumerator',
        'uuid',
        'input_code',
        'complete'
    ];

    function answers()
    {
        return $this->hasMany('App\Answer');
    }
}
