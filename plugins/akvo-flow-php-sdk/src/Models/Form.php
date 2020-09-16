<?php

namespace Akvo\Models;

use Illuminate\Database\Eloquent\Model;

class Form extends Model
{
    protected $primaryKey = 'id';
    public $incrementing = false;

    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = ['id', 'survey_id', 'name'];

    public function survey()
    {
        return $this->belongsTo('Akvo\Models\Survey');
    }

    public function formInstances()
    {
        return $this->hasMany('Akvo\Models\FormInstance');
    }

    public function questionGroups()
    {
        return $this->hasMany('Akvo\Models\QuestionGroup');
    }

    public function questions()
    {
        return $this->hasMany('Akvo\Models\Question');
    }
}
