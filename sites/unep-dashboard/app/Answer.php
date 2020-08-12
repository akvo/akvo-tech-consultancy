<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = ['datapoint_id', 'question_id', 'value'];

    public function datapoint()
    {
        return $this->belongsTo('App\Datapoint');
    }

    public function question()
    {
        return $this->belongsTo('App\Question');
    }

    public function keywords()
    {
        return $this->find(config('report.questions.keywords.id'));
    }

    public function furtherInfo()
    {
        return $this->find(config('report.questions.further_info.id'));
    }
}
