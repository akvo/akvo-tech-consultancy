<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserForm extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'form_id'];

    public function user() {
        return $this->belongsTo('App\Models\User');
    }

    public function forms() {
        return $this->hasMany('App\Models\Form');
    }
}
