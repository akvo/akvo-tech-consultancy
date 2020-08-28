<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = ['parent_id', 'code', 'name', 'type'];

    public function answers()
    {
        return $this->hasMany('App\Answer');
    }

    public function childrens()
    {
        return $this->hasMany('App\Question', 'parent_id', 'id')->with('childrens');
    }

    public function parents()
    {
        return $this->hasMany('App\Question', 'id', 'parent_id');
    }

    public function value()
    {
        return $this->belongsTo('App\Value');
    }
}
