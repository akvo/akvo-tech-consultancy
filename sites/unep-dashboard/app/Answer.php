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
}
