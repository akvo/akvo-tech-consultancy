<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CountryGroup extends Model
{
    public $timestamps = false;
    protected $fillable = ['group_id', 'country_id'];
    protected $hidden = ['group_id', 'country_id'];

    public function country()
    {
        return $this->belongsTo('App\Country');
    }

    public function group()
    {
        return $this->belongsTo('App\Group');
    }
}
