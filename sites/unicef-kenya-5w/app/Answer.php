<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = ['form_instance_id', 'question_id', 'name', 'value', 'repeat_index'];

    public function formInstance()
    {
        return $this->belongsTo('App\FormInstance');
    }

    public function question()
    {
        return $this->belongsTo('App\Question');
    }

    public function options()
    {
        return $this->belongsToMany('App\Option');
    }

    public function cascades()
    {
        return $this->belongsToMany('App\Cascade');
    }
}
