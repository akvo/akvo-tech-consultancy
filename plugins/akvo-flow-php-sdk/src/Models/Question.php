<?php

namespace Akvo\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Question extends Model
{
    protected $primaryKey = 'id';
    public $incrementing = false;

    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = ['id', 'form_id', 'question_group_id', 'cascade_id', 'name', 'type', 'dependency','dependency_answer'];
    protected $append = ['domains'];

    public function getDomainsAttribute()
    {
        $name = Str::lower($this->name);
        if (Str::contains($name, ' - quantity')){
            $name = Str::afterLast($name, ' - quantity ');
        };
        $name = Str::replaceFirst(' beneficiaries ', '_' , $name);
        $name = Str::replaceFirst(' to date', '' , $name);
        $name = str_replace(" ","_",$name);
        return $name;
    }

    public function form()
    {
        return $this->belongsTo('Akvo\Models\Form');
    }

    public function questionGroup()
    {
        return $this->belongsTo('Akvo\Models\QuestionGroup');
    }

    public function answers()
    {
        return $this->hasMany('Akvo\Models\Answer');
    }

    public function options()
    {
        return $this->hasMany('Akvo\Models\Option');
    }

    public function cascade()
    {
        return $this->belongsTo('Akvo\Models\Cascade');
    }

    public function dependencyChilds()
    {
        return $this->hasMany('Akvo\Models\Question', 'dependency', 'id');
    }

    public function dependencyParent()
    {
        return $this->belongsTo('Akvo\Models\Question', 'id', 'dependency');
    }
}
