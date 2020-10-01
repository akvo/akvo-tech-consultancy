<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RsrDimensionValue extends Model
{
    protected $hidden = ['created_at','updated_at'];
    protected $fillable = ['rsr_dimension_id', 'parent_dimension_value', 'name', 'value'];

    public function rsr_dimension()
    {
        return $this->belongsTo('\App\RsrDimension');
    }

    public function rsr_period_dimension_values()
    {
        return $this->hasMany('\App\RsrPeriodDimensionValue');
    }

    public function childrens()
    {
        return $this->hasMany('\App\RsrDimensionValue','parent_dimension_value','id');
    } 

    public function parents()
    {
        return $this->belongsTo('\App\RsrDimensionValue','parent_dimension_value','id');
    }
}
