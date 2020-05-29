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
}
