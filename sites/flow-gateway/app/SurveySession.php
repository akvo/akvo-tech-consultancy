<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Localization;
use App\Answer;

class SurveySession extends Model
{
    protected $table = 'survey_sessions';
    protected $fillable = [
        'session_id',
        'instance_name',
        'form_id',
        'form_name',
        'app',
        'version',
        'default_lang',
        'phone_number',
        'uuid',
        'complete'
    ];

    function check($phone_number, $instance_name, $form_id)
    {
        return $this
            ->where('phone_number', $phone_number)
            ->where('instance_name', $instance_name)
            ->where('form_id', $form_id)
            ->where('complete', false)
            ->first();
    }

    function answers()
    {
        return $this->hasMany('App\Answer');
    }

    function pending_answer()
    {
        return $this->answers()->where('waiting', 1);
    }

    public function fetch_lang($session)
    {
        return $this->where('id', $session->id)
                    ->with(['answers.localizations' => function($q) use ($session) {
                        $q->where('version', $session->version);
                    }])->first();
    }

    public function check_lang($question)
    {
        if (!$question) {
            return $question;
        }
        $localization = Localization::where('question_id', $question->question_id)
                                    ->where('version', $this->version)
                                    ->where('lang', $this->default_lang)
                                    ->first();
        
        if (!empty($localization)) {
            $question['text'] = $localization->text;
            $question->original = $question->getAttributes();
        } 
        return $question;
    }
}
