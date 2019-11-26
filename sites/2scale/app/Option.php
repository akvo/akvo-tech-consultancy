<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Option extends Model
{
    protected $table = 'options';
    protected $hidden = ['created_at', 'updated_at'];

    public function question() {
        return $this->belongsTo('App\Question', 'question_id');
    } 
}
