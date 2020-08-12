<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Datapoint extends Model
{
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = ['uuid', 'funds','contribution', 'datapoint_id'];

    public function countries()
    {
        return $this->hasMany('App\DatapointCountry');
    }

    public function values()
    {
        return $this->hasMany('App\DatapointValue');
    }

    public function answers()
    {
        return $this->hasMany('App\Answer');
    }

    public function title()
    {
        $question = \App\Question::where('code', config('report.questions.project_title.code'))->first();
        return $this->hasOne('App\Answer')->where('question_id', $question->id);
    }
}
