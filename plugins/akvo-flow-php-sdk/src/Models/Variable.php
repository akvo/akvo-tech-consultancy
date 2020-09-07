<?php

namespace Akvo\Models;

use Illuminate\Database\Eloquent\Model;

class Variable extends Model
{
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = ['name'];

    public function questions()
    {
        return $this->hasMany('Akvo\Models\Question');
    }
}
