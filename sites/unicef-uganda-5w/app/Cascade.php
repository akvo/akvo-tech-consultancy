<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Cascade extends Model
{
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = ['parent_id', 'code', 'name', 'level'];
    protected $appends = ['text'];

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

    public function parents()
    {
        return $this->belongsTo('App\Cascade', 'parent_id', 'id');
    }

    public function childrenNested()
    {
        return $this->hasMany(self::class, 'parent_id')->with('childrenNested');
    }

    public function childrenNestedId()
    {
        return $this->hasMany(self::class, 'parent_id')->with('childrenNested');
    }

    public function getTextAttribute()
    {
        return Str::title($this->name);
    }
}
