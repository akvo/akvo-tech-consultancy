<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Data extends Model
{
    protected $table = 'data';
    protected $fillable = ['question_id', 'datapoint_id', 'answer', 'country', 'submission_date'];
    //
    public function question() {
        return $this->belongsTo('App\Question', 'question_id');
    } 
}
