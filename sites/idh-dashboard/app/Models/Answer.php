<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{

    protected $appends = ['type'];
    protected $hidden = ['form_instance_id','type','created_at','updated_at'];
    protected $fillable = ['id','form_instance_id', 'variable_id','value','created_at','updated_at'];

    public function getTypeAttribute() {
        return \App\Models\Variable::select('type')
            ->where('id', $this->variable_id)
            ->first()
            ->type;
    }

    public function variable() {
        return $this->belongsTo('\App\Models\Variable');
    }

    public function options() {
        return $this->hasMany('\App\Models\AnswerOption');
    }

}
