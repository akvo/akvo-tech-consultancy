<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $primaryKey = 'id';
    public $incrementing = false;

    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = ['id', 'form_id', 'question_group_id', 'cascade_id', 'name', 'type'];

    public function form()
    {
        return $this->belongsTo('App\Form');
    }


    public function questioGroup()
    {
        return $this->belongsTo('App\QuestionGroup');
    }

    public function answers()
    {
        return $this->hasMany('App\Answer');
    }

    public function options()
    {
        return $this->hasMany('App\Option');
    }

    public function cascade()
    {
        return $this->belongsTo('App\Cascade');
    }
}
