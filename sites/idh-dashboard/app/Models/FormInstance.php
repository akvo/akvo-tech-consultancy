<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormInstance extends Model
{
    protected $hidden = ['identifier','form_id','created_at', 'updated_at'];

    public function form()
    {
        return $this->belongsTo('\App\Models\Form');
    }

    public function answers()
    {
        $value = $this->hasMany('\App\Models\Answer')
                      ->with(['variable','options']);
        return $value;
    }
}

