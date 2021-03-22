<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Form extends Model
{
    use HasFactory;

    protected $fillable = ['fid', 'country', 'kind', 'company'];
    protected $hidden = ['fid','created_at', 'updated_at'];

    public function formInstances()
    {
        return $this->hasMany('App\Models\FormInstance');
    }

}
