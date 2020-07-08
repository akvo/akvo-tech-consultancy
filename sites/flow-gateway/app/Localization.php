<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Localization extends Model
{
    protected $table = 'localizations';
    protected $fillable = [
        'question_id',
        'version',
        'text',
        'lang'
    ];

    public function answer()
    {
        return $this->belongsTo('App\Answer', 'question_id', 'question_id');
    }
}
