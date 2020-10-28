<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Log extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'form_id'];

    protected $hidden = ['updated_at'];

    public function form()
    {
        return $this->belongsTo('App\Models\Form');
    }

    public function user()
    {
        return $this->belongsTo('App\Models\User')->select('id','name','role');
    }

}
