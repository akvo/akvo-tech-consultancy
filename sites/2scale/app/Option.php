<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Option extends Model
{
    protected $table = 'options';
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = ['question_id', 'code' ,'text', 'type'];

    public function question() {
        return $this->belongsTo('App\Question');
    } 
}
