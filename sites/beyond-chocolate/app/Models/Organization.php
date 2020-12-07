<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    use HasFactory;

    protected $hidden = ['created_at','updated_at'];
    protected $fillable = ['parent_id', 'code', 'name'];

    public function childrens()
    {
        return $this->hasMany('\App\Models\Organization','parent_id','id');
    } 

    public function parents()
    {
        return $this->belongsTo('\App\Models\Organization','parent_id','id');
    } 

    public function user()
    {
        return $this->hasMany('\App\Models\User');
    }

    public function webforms()
    {
        return $this->hasMany('\App\Models\WebForm');
    }
}
