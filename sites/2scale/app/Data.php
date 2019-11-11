<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Data extends Model
{
    protected $table = 'data';
    //
    public function question() {
        return $this->belongsTo('App\Question', 'question_id');
    } 
}
