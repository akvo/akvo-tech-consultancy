<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RsrPeriodData extends Model
{
    protected $hidden = ['created_at','updated_at'];
    protected $fillable = ['id', 'rsr_period_id', 'value', 'text', 'created_at','updated_at'];

    public function rsr_period()
    {
        return $this->belongsTo('\App\RsrPeriod');
    }
}
