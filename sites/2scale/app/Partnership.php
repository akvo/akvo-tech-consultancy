<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Partnership extends Model
{
    protected $hidden = ['created_at','updated_at'];
    protected $fillable = ['parent_id','cascade_id','code','name','level'];

    public function childrens()
    {
        return $this->hasMany('\App\Partnership','parent_id','id');
    } 

    public function parents()
    {
        return $this->belongsTo('\App\Partnership','id','parent_id');
    } 
}
