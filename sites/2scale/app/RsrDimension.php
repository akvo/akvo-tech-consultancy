<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RsrDimension extends Model
{
    protected $hidden = ['created_at','updated_at'];
    // protected $fillable = ['id', 'rsr_indicator_id', 'rsr_project_id', 'parent_dimension_name', 'name'];
    protected $fillable = ['id', 'rsr_indicator_id', 'rsr_project_id', 'parent_dimension_name'];
    protected $appends = ['name'];

    public function rsr_indicator()
    {
        return $this->belongsTo('\App\RsrIndicator');
    }

    public function rsr_dimension_values()
    {
        return $this->hasMany('\App\RsrDimensionValue');
    }

    public function childrens()
    {
        return $this->hasMany('\App\RsrDimension','parent_dimension_name','id');
    } 

    public function parents()
    {
        return $this->belongsTo('\App\RsrDimension','parent_dimension_name','id');
    }

    public function rsr_titles()
    {
        return $this->morphToMany('App\RsrTitle', 'rsr_titleable');
    }

    public function getNameAttribute($value)
    {
        return $this->rsr_titles()->pluck('title')[0];
    }
}
