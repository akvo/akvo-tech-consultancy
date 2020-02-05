<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Value extends Model
{
    protected $fillable = ['name', 'description', 'color'];
    public $timestamps = false;

    public function countries()
    {
        return $this->belongsToMany('App\Country', 'App\CountryValue');
    }

    public function country_values()
    {
        return $this->hasMany('App\CountryValue');
    }

    public function childrens()
    {
        return $this->hasMany('App\Value', 'parent_id', 'id');
    }

    public function parents()
    {
        return $this->hasMany('App\Value', 'id', 'parent_id');
    }

    public function childs()
    {
        return $this->hasMany('App\Value', 'parent_id', 'id')->select('id','parent_id','code','name');
    }

}
