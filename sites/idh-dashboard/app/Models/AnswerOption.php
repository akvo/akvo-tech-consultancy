<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnswerOption extends Model
{
    use HasFactory;

    protected $fillable = ['answer_id','option_id'];
    protected $hidden = ['id','answer_id','created_at', 'updated_at'];

    public function option() {
        return $this->belongsTo('App\Models\Option');
    }

    public function answer() {
        return $this->belongsTo('App\Models\Answer');
    }
}
