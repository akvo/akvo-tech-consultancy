<?php

namespace Akvo\Models;

use Illuminate\Database\Eloquent\Model;

class Survey extends Model
{
    protected $primaryKey = 'id';
    public $incrementing = false;

    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = ['id', 'name', 'registration_id'];

    public function forms()
    {
        return $this->hasMany('Akvo\Models\Form');
    }

    public function dataPoints()
    {
        return $this->hasMany('Akvo\Models\DataPoint');
    }

    public function sync()
    {
        return $this->hasOne('Akvo\Models\Sync');
    }
}
