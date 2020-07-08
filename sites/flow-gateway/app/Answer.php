<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    protected $table = 'answers';
    protected $fillable = [
        'survey_session_id',
        'waiting',
        'question_id',
        'dependency',
        'dependency_answer',
		'datapoint',
        'order',
        'mandatory',
        'type',
        'text',
        'cascade',
        'cascade_lv',
        'input'
    ];

    function survey_session()
    {
        return $this->belongsTo('App\SurveySession');
    }

    public function localizations()
    {
        return $this->hasMany('App\Localization', 'question_id', 'question_id');
    }
}
