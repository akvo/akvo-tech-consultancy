<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Grimzy\LaravelMysqlSpatial\Eloquent\SpatialTrait;

class DataPoint extends Model
{
    //use SpatialTrait;

    protected $primaryKey = 'id';
    public $incrementing = false;

    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = ['id', 'survey_id', 'display_name', 'position'];
    //protected $spatialFields = ['position'];

    public function survey()
    {
        return $this->belongsTo('App\Survey');
    }

    public function formInstance()
    {
        return $this->hasMany('App\FormInstance');
    }
}
