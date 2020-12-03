<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    protected $fillable = ['question_id','datapoint_id','text','value','options', 'repeat_index'];
    protected $hidden = ['created_at', 'updated_at'];

    public function forms()
    {
        return $this->belongsTo('\App\Form','form_id','form_id');
    } 

    public function questions() {
        return $this->belongsTo('App\Question','question_id','question_id');
    }

    public function datapoints() {
        return $this->belongsTo('App\Datapoint','datapoint_id','id');
    }

    public function options() {
        return $this->belongsTo('App\Datapoint','datapoint_id','datapoint_id');
    }
}
