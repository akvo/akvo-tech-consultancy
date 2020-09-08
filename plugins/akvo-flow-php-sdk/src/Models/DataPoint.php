<?php

namespace Akvo\Models;

use Illuminate\Database\Eloquent\Model;

class DataPoint extends Model
{

    protected $primaryKey = 'id';
    public $incrementing = false;

    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = ['id', 'survey_id', 'display_name', 'position', 'created_at'];

    public function survey()
    {
        return $this->belongsTo('Akvo\Models\Survey');
    }

    public function formInstance()
    {
        return $this->hasMany('Akvo\Models\FormInstance');
    }
}
