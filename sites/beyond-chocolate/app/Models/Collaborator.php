<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Collaborator extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['organization_id', 'web_form_id'];
    protected $hidden = ['created_at', 'updated_at'];

    public function webform()
    {
        return $this->belongsTo('\App\Models\WebForm');
    }

    public function organization()
    {
        return $this->belongsTo('\App\Models\Organization');
    }
}
