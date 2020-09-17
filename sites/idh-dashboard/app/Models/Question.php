<?php

namespace App\Models;

use Akvo\Models\Question as AkvoQuestion;
use Illuminate\Support\Str;

class Question extends AkvoQuestion
{

    protected $hidden = [
        'created_at',
        'updated_at',
        'form_id',
        'cascade_id',
        'question_group_id',
        'dependency',
        'dependency_answer'
    ];

    protected $appends = ['variable_name'];

    public function fsize() {
        return $this->with('variable');
    }

    public function getVariableNameAttribute() {
        $variable = \Akvo\Models\Variable::find($this->variable_id);
        $variable = Str::after($variable->name, '_');
        $variable = str_replace('_', ' ', $variable);
        return Str::title($variable);
    }

}
