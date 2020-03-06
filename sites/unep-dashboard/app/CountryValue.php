<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CountryValue extends Model
{
    protected $fillable = ['value_id', 'country_id', 'value'];
    protected $hidden = ['created_at','updated_at'];
    public $timestamps = false;

    public function country()
    {
        return $this->belongsTo('App\Country');
    }

    public function value()
    {
        return $this->belongsTo('App\Value');
    }

    public function group()
    {
        return $this->hasMany('App\CountryGroup', 'country_id','country_id');
    }

}
