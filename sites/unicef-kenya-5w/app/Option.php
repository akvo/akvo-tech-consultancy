<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Option extends Model
{
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = ['question_id', 'code', 'name', 'other'];

    public function question()
    {
        return $this->belongsTo('App\Question');
    }

    public function answers()
    {
        return $this->belongsToMany('App\Answer', 'answer_options');
    }

    public function dependencyAnswers($ids)
    {
        // question.dependencychilds otomatis return semua question dependency, bukan sesuai yang di option;
        return $this->whereIn('id', $ids)
                    ->has('answers')
                    ->has('question.dependencyChilds.answers')
                    ->with('question.dependencyChilds.answers')
                    ->get();
    }
}
