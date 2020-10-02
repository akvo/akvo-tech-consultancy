<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RsrPeriodDimensionValue extends Model
{
    protected $hidden = ['created_at','updated_at'];
    protected $fillable = ['id', 'rsr_period_id', 'rsr_dimension_value_id', 'value'];

    public function rsr_period()
    {
        return $this->belongsTo('\App\RsrPeriod');
    }

    public function rsr_dimension_value()
    {
        return $this->belongsTo('\App\RsrDimensionValue');
    }
}
