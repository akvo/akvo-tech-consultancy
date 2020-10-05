<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RsrResult extends Model
{
    protected $hidden = ['created_at','updated_at'];
    // protected $fillable = ['id', 'rsr_project_id', 'parent_result', 'title', 'description', 'order'];
    protected $fillable = ['id', 'rsr_project_id', 'parent_result', 'order'];
    protected $appends = ['title', 'description'];


    public function rsr_project()
    {
        return $this->belongsTo('\App\RsrProject');
    }

    public function rsr_indicators()
    {
        return $this->hasMany('\App\RsrIndicator');
    }

    public function childrens()
    {
        return $this->hasMany('\App\RsrResult','parent_result','id');
    } 

    public function parents()
    {
        return $this->belongsTo('\App\RsrResult','parent_result','id');
    }

    public function rsr_titles()
    {
        return $this->morphToMany('App\RsrTitle', 'rsr_titleable');
    }

    public function getTitleAttribute($value)
    {
        return $this->rsr_titles()->pluck('title')[0];
    }

    public function getDescriptionAttribute($value)
    {
        return $this->rsr_titles()->pluck('description')[0];
    }
}
