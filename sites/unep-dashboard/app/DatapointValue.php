<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DatapointValue extends Model
{
    protected $fillable = ['datapoint_id','value_id'];
    protected $hidden = ['id', 'datapoint_id','created_at','updated_at'];
    public $timestamps = false;

    public function value()
    {
        return $this->belongsTo('App\Value');
    }

    public function datapoint()
    {
        return $this->belongsTo('App\Datapoint');
    }

    public function countries()
    {
        return $this->hasMany('App\DatapointCountry','datapoint_id', 'datapoint_id');
    }

}
