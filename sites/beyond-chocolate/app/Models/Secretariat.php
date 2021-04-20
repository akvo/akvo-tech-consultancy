<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Secretariat extends Model
{
    use HasFactory;

    public function organizations()
    {
        return $this->belongsToMany(Organization::class);
    }
}
