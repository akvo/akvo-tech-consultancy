<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Cascade extends Model
{
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = ['parent_id', 'code', 'name'];

    public function questions()
    {
        return $this->hasMany('App\Question');
    }

    public function answers()
    {
        return $this->belongsToMany('App\Answer');
    }
}
