<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    protected $fillable = ['name', 'code', 'description'];
    public $timestamps = false;

    public function groups()
    {
        return $this->belongsToMany('App\Group', 'App\CountryGroup');
    }

    public function values()
    {
        return $this->hasManyTrough('App\Value', 'App\CountryValue');
    }

}
