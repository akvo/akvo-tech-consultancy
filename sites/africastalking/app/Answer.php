<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    protected $table = 'answers';

    function survey_session()
    {
        return $this->belongsTo('App\SurveySession');
    }
}
