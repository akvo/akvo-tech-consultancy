<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Survey extends Model
{
    protected $primaryKey = 'id';
    public $incrementing = false;

    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = ['id', 'name', 'registration_id'];

    public function forms()
    {
        return $this->hasMany('App\Form');
    }

    public function dataPoints()
    {
        return $this->hasMany('App\DataPoint');
    }

    public function sync()
    {
        return $this->hasOne('App\Sync');
    }
}
