<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RsrTitleable extends Model
{
    protected $hidden = ['created_at','updated_at'];
    protected $fillable = ['id', 'rsr_title_id', 'rsr_titleable_id', 'rsr_titleable_type'];
}
