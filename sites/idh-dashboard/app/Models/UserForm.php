<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserForm extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'form_id', 'access'];
    protected $hidden = ['id','user_id','created_at','updated_at'];

    public function user() {
        return $this->belongsTo('App\Models\User');
    }

    public function form() {
        return $this->belongsTo('App\Models\Form');
    }

}
