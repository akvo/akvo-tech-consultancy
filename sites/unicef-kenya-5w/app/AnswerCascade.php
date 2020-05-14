<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AnswerCascade extends Model
{
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = ['answer_id', 'cascade_id'];

    public function answer()
    {
        return $this->belongsTo('App\Answer');
    }
}
