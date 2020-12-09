<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AnswerOption extends Model
{
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = ['answer_id', 'option_id'];

    public function answer()
    {
        return $this->belongsTo('App\Answer');
    }

    public function option()
    {
        return $this->belongsTo('App\Option');
    }
}
