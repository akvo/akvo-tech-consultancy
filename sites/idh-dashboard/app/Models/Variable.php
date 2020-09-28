<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Variable extends Model
{
    protected $hidden = ['id','type','created_at', 'updated_at'];
    protected $fillable = ['id','name', 'type','created_at','updated_at'];
    protected $appends = ['display'];

    public function options()
    {
        return $this->hasMany('\App\Models\VariableOption');
    }

    public function getDisplayAttribute()
    {
        return Str::after($this->name, '_');
    }

}
