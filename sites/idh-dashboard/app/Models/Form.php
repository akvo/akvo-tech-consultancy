<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Form extends Model
{

    protected $primaryKey = 'id';
    public $incrementing = false;

    protected $hidden = ['created_at','updated_at'];
    protected $fillable = ['id', 'survey_id', 'name'];

    public function survey()
    {
        return $this->belongsTo('\App\Models\Survey');
    }

    public function formInstances()
    {
        return $this->hasMany('\App\Models\FormInstance');
    }

    public function questionGroups()
    {
        return $this->hasMany('\App\Models\QuestionGroup');
    }

    public function questions()
    {
        return $this->hasMany('\App\Models\Question');
    }

    public function answers()
    {
        return $this->hasManyThrough('\App\Models\Answer','\App\Models\FormInstance');
    }

}
