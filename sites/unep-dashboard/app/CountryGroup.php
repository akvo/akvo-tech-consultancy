<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CountryGroup extends Model
{
    public $timestamps = false;
    protected $fillable = ['group_id', 'country_id'];
    protected $hidden = ['country_id'];

    public function country()
    {
        return $this->belongsTo('App\Country');
    }

    public function group()
    {
        return $this->belongsTo('App\Group');
    }

    public function values()
    {
        return $this->hasMany('App\CountryValue','country_id','country_id');
    }
}
