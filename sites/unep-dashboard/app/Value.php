<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Value extends Model
{
    protected $fillable = ['name', 'value', 'description', 'color'];
    public $timestamps = false;

    public function groups()
    {
        return $this->hasManyTrough('App\Group', 'App\Country');
    }

    public function countries()
    {
        return $this->belongsToMany('App\Country');
    }

    public function childrens()
    {
        return $this->hasMany('App\Value', 'parent_id', 'id');
    }

    public function parents()
    {
        return $this->hasMany('App\Value', 'id', 'parent_id');
    }
}
