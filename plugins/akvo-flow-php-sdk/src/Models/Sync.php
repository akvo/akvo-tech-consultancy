<?php

namespace Akvo\Models;

use Illuminate\Database\Eloquent\Model;

class Sync extends Model
{
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = ['survey_id', 'url'];

    public function survey()
    {
        return $this->belongsTo('Akvo\Models\Survey');
    }
}
