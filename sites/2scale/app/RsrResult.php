<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RsrResult extends Model
{
    protected $hidden = ['created_at','updated_at'];
    protected $fillable = ['rsr_project_id', 'title', 'description', 'order', 'aggregation'];

    public function rsr_project()
    {
        return $this->belongsTo('\App\RsrProject');
    }

    public function rsr_indicators()
    {
        return $this->hasMany('\App\RsrIndicator');
    }

    public function childrens()
    {
        return $this->hasMany('\App\RsrResult','parent_result','id');
    } 

    public function parents()
    {
        return $this->belongsTo('\App\RsrResult','parent_result','id');
    }
}
