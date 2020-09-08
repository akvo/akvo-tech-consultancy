<?php

namespace Akvo\Models;

use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = ['form_instance_id', 'question_id', 'name', 'value', 'repeat_index'];

    public function formInstance()
    {
        return $this->belongsTo('Akvo\Models\FormInstance');
    }

    public function question()
    {
        return $this->belongsTo('Akvo\Models\Question');
    }

    public function options()
    {
        return $this->hasOne('Akvo\Models\AnswerOption');
    }

    public function cascade()
    {
        return $this->hasOne('Akvo\Models\AnswerCascade');
    }
}
