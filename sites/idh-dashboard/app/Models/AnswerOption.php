<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnswerOption extends Model
{
    protected $hidden = ['id','answer_id','created_at','updated_at'];
    protected $fillable = ['answer_id', 'variable_option_id'];
    protected $appends = ['name'];

    public function answer()
    {
        return $this->belongsTo('\App\Models\Answer');
    }

    public function getNameAttribute()
    {
        return \App\Models\VariableOption::where('id', $this->variable_option_id)->first()->name;
    }

}
