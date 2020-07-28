<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Value extends Model
{
    protected $hidden = ['units', 'description', 'color','type'];
    protected $fillable = ['name', 'code', 'description', 'color', 'type'];
    public $timestamps = false;

    public function destroyMany(array $ids)
    {
        return $this->destroy($ids);
    }

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
        return $this->hasMany('App\Value', 'parent_id', 'id')->with('childrens');
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
