<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RsrIndicator extends Model
{
    protected $hidden = ['created_at','updated_at'];
    // protected $fillable = ['id', 'rsr_result_id', 'parent_indicator', 'title', 'description', 
    //                         'baseline_year', 'baseline_value', 'target_value', 'order',
    //                         'has_dimension'
    //                     ];
    protected $fillable = ['id', 'rsr_result_id', 'parent_indicator', 'baseline_year', 'baseline_value', 'target_value', 'order', 'has_dimension'];
    protected $appends = ['title', 'description'];

    public function rsr_result()
    {
        return $this->belongsTo('\App\RsrResult');
    }

    public function rsr_periods()
    {
        return $this->hasMany('\App\RsrPeriod');
    }

    public function rsr_dimensions()
    {
        return $this->hasMany('\App\RsrDimension');
    }

    public function childrens()
    {
        return $this->hasMany('\App\RsrIndicator','parent_indicator','id');
    } 

    public function parents()
    {
        return $this->belongsTo('\App\RsrIndicator','parent_indicator','id');
    }

    public function rsr_titles()
    {
        return $this->morphToMany('App\RsrTitle', 'rsr_titleable');
    }

    public function getTitleAttribute($value)
    {
        return $this->rsr_titles()->pluck('title')[0];
    }

    public function getDescriptionAttribute($value)
    {
        return $this->rsr_titles()->pluck('description')[0];
    }
}
