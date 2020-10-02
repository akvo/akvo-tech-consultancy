<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Partnership extends Model
{
    protected $hidden = ['created_at','updated_at'];
    protected $fillable = ['parent_id','cascade_id','code','name','level'];

    public function childrens()
    {
        return $this->hasMany('\App\Partnership','parent_id','id');
    } 

    public function parents()
    {
        return $this->belongsTo('\App\Partnership','parent_id','id');
    } 

    public function country_datapoints()
    {
        return $this->hasMany('\App\Datapoint','country_id','id');
    }

    public function partnership_datapoints()
    {
        return $this->hasMany('\App\Datapoint','partnership_id','id');
    }

    public function rsr_project()
    {
        return $this->hasOne('\App\RsrProject');
    }

    public function rsr_results()
    {
        return $this->hasManyThrough('\App\RsrResult', '\App\RsrProject');
    }
}
