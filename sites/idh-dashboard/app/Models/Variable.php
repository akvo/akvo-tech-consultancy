<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Variable extends Model
{
    protected $hidden = ['id','type','created_at', 'updated_at'];
    protected $fillable = ['id','name', 'type','created_at','updated_at'];

    public function options()
    {
        return $this->hasMany('\App\Models\VariableOption');
    }

}
