<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    protected $fillable = ['name', 'description', 'code'];
    public $timestamps = false;

    public function countries()
    {
        return $this->hasMany('App\Country');
    }

    public function childrens()
    {
        return $this->hasMany('App\Group', 'parent_id', 'id');
    }

    public function parents()
    {
        return $this->hasMany('App\Group', 'id', 'parent_id');
    }

    public function values()
    {
        return $this->hasManyTrough('App\Value', 'App\Country');
    }

}
