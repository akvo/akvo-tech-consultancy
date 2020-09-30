<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Option extends Model
{
    use HasFactory;

    protected $fillable = ['variable_id','name'];
    protected $hidden = ['created_at', 'updated_at'];
    protected $appends = ['text'];

    public function variable() {
        return $this->belongsTo('App\Models\Variable');
    }

    public function getTextAttribute()
    {
        return Str::title($this->name);
    }
}
