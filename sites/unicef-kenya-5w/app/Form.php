<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Form extends Model
{
    protected $primaryKey = 'id';
    public $incrementing = false;

    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = ['id', 'survey_id', 'name'];

    public function survey()
    {
        return $this->belongsTo('App\Survey');
    }

    public function formInstances()
    {
        return $this->hasMany('App\FormInstance');
    }

    public function questionGroups()
    {
        return $this->hasMany('App\QuestionGroup');
    }

    public function questions()
    {
        return $this->hasMany('App\Question');
    }
}
