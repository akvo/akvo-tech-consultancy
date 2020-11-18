<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class QuestionGroup extends Model
{
    protected $primaryKey = 'id';
    public $incrementing = false;

    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = ['id', 'form_id', 'repeat', 'name'];

    public function form()
    {
        return $this->belongsTo('App\Form');
    }

    public function questions()
    {
        return $this->hasMany('App\Question');
    }
}
