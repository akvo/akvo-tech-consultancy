<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;

class DataSource extends Model
{
    public function setConfigAttribute($value)
    {
        $this->attributes['config'] = json_decode($value, True);
    }

    public function childrens()
    {
        return $this->hasMany('App\DataSource', 'parent_id', 'id')
                    ->select('id', 'parent_id', 'type', 'source');
    }

    public function parents()
    {
        return $this->belongsTo('App\DataSource', 'parent_id', 'id')
                    ->select('id', 'parent_id', 'type', 'source');
    }
}
