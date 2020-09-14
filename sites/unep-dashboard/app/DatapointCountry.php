<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DatapointCountry extends Model
{
    protected $fillable = ['value_id', 'datapoint_id'];
    protected $hidden = ['id', 'datapoint_id','created_at','updated_at'];
    public $timestamps = false;

    public function country()
    {
        return $this->belongsTo('App\Country');
    }

    public function datapoint()
    {
        return $this->belongsTo('App\Datapoint');
    }

    public function group()
    {
        return $this->hasMany('App\CountryGroup', 'country_id','country_id');
    }

    public function values()
    {
        return $this->belongsTo('App\DatapointValue','datapoint_id', 'datapoint_id');
    }

}
