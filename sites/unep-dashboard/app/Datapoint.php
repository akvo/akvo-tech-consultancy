<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Datapoint extends Model
{
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = ['uuid', 'funds','contribution', 'datapoint_id'];

    public function countries()
    {
        return $this->hasMany('App\DatapointCountry');
    }

    public function values()
    {
        return $this->hasMany('App\DatapointValue');
    }

    public function answers()
    {
        return $this->hasMany('App\Answers');
    }
}
