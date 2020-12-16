<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Variable extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'type'];
    protected $hidden = ['created_at', 'updated_at'];


    public function getTextAttribute()
    {
        $title = Str::after($this->name, 'f_');
        $title = Str::after($title, 'pi_');
        $title = str_replace('_', ' ', $title);
        $title = Str::title($title);
        return $title;
    }
}
