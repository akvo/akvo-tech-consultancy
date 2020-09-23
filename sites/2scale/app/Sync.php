<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Sync extends Model
{
    protected $table = 'syncs';
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = ['url'];
}
