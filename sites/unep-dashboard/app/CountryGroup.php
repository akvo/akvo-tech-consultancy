<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CountryGroup extends Model
{
    public $timestamps = false;
    protected $fillable = ['group_id', 'country_id'];
}
