<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class QuestionGroup extends Model
{
    protected $table = 'question_groups';
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = ['form_id', 'name', 'repeat'];

    public function form()
    {
        return $this->belongsTo('App\Form', 'form_id', 'form_id');
    }

    public function questions()
    {
        return $this->hasMany('App\Question');
    }
    
}
