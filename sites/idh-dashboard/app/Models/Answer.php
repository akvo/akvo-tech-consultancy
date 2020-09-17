<?php

namespace App\Models;

use Akvo\Models\Answer as AkvoAnswer;

class Answer extends AkvoAnswer
{

    protected $appends = ['type'];

    public function getTypeAttribute() {
        return \Akvo\Models\Question::select('type')
            ->where('id', $this->question_id)
            ->first()
            ->type;
    }

}
