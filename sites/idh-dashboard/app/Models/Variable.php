<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Variable extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'type'];
    protected $hidden = ['created_at', 'updated_at'];

}
