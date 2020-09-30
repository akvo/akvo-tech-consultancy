<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormInstance extends Model
{
    use HasFactory;

    protected $fillable = ['form_id','identifier'];
    protected $hidden = ['created_at', 'updated_at'];

    public function form() {
        return $this->belongsTo('App\Models\Form');
    }

    public function answers() {
        return $this->hasMany('App\Models\Answer');
    }

}
