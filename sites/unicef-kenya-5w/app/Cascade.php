<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Cascade extends Model
{
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = ['parent_id', 'code', 'name'];

    public function questions()
    {
        return $this->hasMany('App\Question');
    }

    public function answers()
    {
        return $this->belongsToMany('App\Answer', 'answer_cascades');
    }

    public function childrens()
    {
        return $this->hasMany('App\Cascade', 'parent_id', 'id');
    }

    public function parent()
    {
        return $this->belongsTo('App\Cascade', 'id', 'parent_id');
    }

    public function childrenNested()
    {
        return $this->childrens();
    }
}
