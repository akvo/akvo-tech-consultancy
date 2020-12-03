<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RsrPeriod extends Model
{
    protected $hidden = ['created_at','updated_at'];
    protected $fillable = ['id', 'rsr_indicator_id', 'parent_period', 'target_value', 
                            'actual_value', 'period_start', 'period_end'
                        ];

    public function rsr_indicator()
    {
        return $this->belongsTo('\App\RsrIndicator');
    }

    public function rsr_period_dimension_values()
    {
        return $this->hasMany('\App\RsrPeriodDimensionValue');
    }

    public function childrens()
    {
        return $this->hasMany('\App\RsrPeriod','parent_period','id');
    } 

    public function parents()
    {
        return $this->belongsTo('\App\RsrPeriod','parent_period','id');
    }

    public function rsr_period_data()
    {
        return $this->hasMany('\App\RsrPeriodData');
    }
}
