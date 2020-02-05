<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CountryValue extends Model
{
    protected $fillable = ['group_id', 'country_id', 'value'];
    protected $hidden = ['country_id','created_at','updated_at', 'value_id'];
    public $timestamps = false;

    public function country()
    {
        return $this->belongsTo('App\Country');
    }

    public function value()
    {
        return $this->belongsTo('App\Value');
    }

}
