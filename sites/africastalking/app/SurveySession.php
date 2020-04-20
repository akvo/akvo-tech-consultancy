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
        'uuid',
        'complete'
    ];

    function check($phone_number, $instance_name, $form_id)
    {
        return $this
            ->where('phone_number', $phone_number)
            ->where('instance_name', $instance_name)
            ->where('form_id', $form_id)
            ->where('complete', false)
            ->first();
    }

    function answers()
    {
        return $this->hasMany('App\Answer');
    }
    function pending_answer()
    {
        return $this->answers()->where('waiting', 1);
    }
}
