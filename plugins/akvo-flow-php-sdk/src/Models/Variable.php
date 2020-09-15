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

    public function answers()
    {
        return $this->hasManyTrough(
            'Akvo\Models\Question',
            'Akvo\Models\Answer'
        );
    }

}
