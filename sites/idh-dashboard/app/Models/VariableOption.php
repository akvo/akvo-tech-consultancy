<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VariableOption extends Model
{
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = ['id','variable_id','name'];

    public function variable()
    {
        return $this->belongsTo('\App\Models\Variable');
    }

    public function answers()
    {
        return $this->hasMany('\App\Models\AnswerOption');
    }

}
