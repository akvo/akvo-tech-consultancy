<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Translation extends Model
{
    protected $hidden = ['id','translationable_type','translationable_id','created_at', 'updated_at'];
    protected $fillable = ['translationable_type', 'translationable_id', 'lang','text'];

    public function translationable()
    {
        return $this->morphTo('translationable');
    }

}
