<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Bridge extends Model
{
    protected $guarded = ['id'];
    protected $hidden = ['created_at', 'updated_at'];
}
