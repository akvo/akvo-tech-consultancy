<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WebForm extends Model
{
    use HasFactory;

    protected $hidden = ['created_at'];
    protected $fillable = [
        'user_id', 'organization_id', 'form_id', 'form_instance_id', 'form_instance_url', 'submitted', 'updated_at', 'display_name', 'uuid'
    ];

    public function user()
    {
        return $this->belongsTo('\App\Models\User');
    }

    public function organization()
    {
        return $this->belongsTo('\App\Models\Organization');
    }
}
