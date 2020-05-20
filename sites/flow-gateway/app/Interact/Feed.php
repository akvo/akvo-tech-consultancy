<?php

namespace App\Interact;

use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Support\Collection;
use App\Http\AkvoFlow;
use App\Interact\Submission;

class Feed
{
    function __construct($prefix, $prefix_end) 
    {
        $this->prefix = $prefix;
        $this->prefix_end = $prefix_end;
    }

    public function show_last_question($session) {
        $current = $session->pending_answer()->first();
        return $this->formatter($current);
    }

    public function continue_survey($value, $session) {
        $current = $session->pending_answer()->first();

        /*
         * $validator = $this->validator($current, $value);
         */
        $validator = $this->validator($current, $value);
        if ($validator) {
            return $this->formatter($current, true);
        }

        /*
         * Don't Update to the Next if it's cascade
         */
        if ($current->type === "cascade") {
            if ($current->input === null) {
                $current->input = $value;
            }
            else {
                $current->input = $current->input."|".$value;
            }
            $current->cascade_lv = $current->cascade_lv - 1;
            $current->save();
            if ($current->cascade_lv !== 0) {
                return $this->formatter($current);
            }
            else {
                $current->waiting = false;
                $current->save();
            }
        }

        /*
         * Get option text from question text 
         */
        if ($current->type === "option") {
            $options = Str::of($current->text)->explode(PHP_EOL);
            $current->input = Str::afterLast($options[$value], '. ');
            $current->waiting = false;
            $current->save();
        }

        /*
         * Update Current Answer
         */
        if ($current->type !== "cascade" && $current->type !== "option") {
            $current->input = $value;
            $current->waiting = false;
            $current->save();
        }

        /*
         * Get Next Question
         */
        $next = $session->answers()->find($current->id + 1);
        if (!$next) {
            $submission = new Submission();
            $submission->send($session->id);
            return $this->prefix_end.trans('text.end');
        }
        $next->waiting = true;
        $next->save();
        $response = $this->formatter($next);
        return $response;
    }

    public function store_questions($survey, $session) 
    {
        $questions;
        $isObject = Arr::has($survey["questionGroup"], "question");
        if ($isObject) {
            $heading = $survey["questionGroup"]["heading"];
            $questions = collect($survey["questionGroup"]["question"])
                ->map(function($question) use ($heading) {
                    return $this->generate_question($question, $heading);
            });
        }
        if (!$isObject) {
            $questions = collect($survey["questionGroup"])->map(function($group){
                return collect($group["question"])->map(function($question) {
                    return $this->generate_question($question);
                })->toArray();
            })->flatten(1);
        }
        $questions = $session->answers()->createMany($questions->toArray());
        $current = $questions->first();
        $current->waiting = true;
        $current->save();
        $response = $this->formatter($current);
        return $response;
    }

    public function generate_question($question) {
        if (Arr::has($question, "validationRule")) {
            $question['type'] = $question['validationRule']['validationType'];
        }
        $options = "";
        $cascade = null;
        $cascade_lv = null;
        if (Arr::has($question, "options")) {
            $opt = $question["options"]["option"];
            $i = 1;
            do {
                $icode = (string) $i;
                if (Arr::has($opt[$i - 1], "code")) {
                    $icode = $opt[$i - 1]["code"];
                    $icode = strtoupper($icode);
                }
                $options .= "\n".$icode.". ".$opt[$i - 1]["text"];
                $i++;
            } while($i <= count($opt));
        }
        if ($question['type'] === "cascade") {
            $cascade = $question["cascadeResource"];
            $cascade_lv = count($question["levels"]["level"]);
        }
        $format = array(
            'question_id' => (int) $question['id'],
            'order' => (int) $question['order'],
            'mandatory' => (int) $question['mandatory'],
            'datapoint' => $question['localeNameFlag'],
            'text' => $question['text'].$options,
            'type' => $question['type'],
            'cascade' => $cascade,
            'cascade_lv' => $cascade_lv
        );
        return $format;
    }

    public function ask($session, $options=false)
    {
        $response = $this->prefix.trans('text.ask.hi', ['phone' => $session->phone_number])."\n";
        $response .= trans('text.ask.info', ['name' => $session->form_name])."\n";
        $response .= trans('text.ask.continue')."\n";
        if ($options) {
            $i = 0;
            $response .= "\n";
            do {
                $response .= $options[$i]."\n";
                $i++;
            } while ($i < count($options));
            return $response;
        }
        $response .= trans('text.ask.response.y')."\n".trans('text.ask.response.n');
        return $response;
    }


    public function destroy($session)
    {
        $session->delete();
        $response = $this->prefix_end.trans('text.destroy.success')."\n";
        $response .= trans('text.destroy.info')."\n";
        return $response;
    }

    public function formatter($question, $repeat=false)
    {
        $text = $this->prefix.$question->text;
        if ($repeat) {
            $temp = (Str::lower($question->type) === 'numeric') ? 'numeric' : 'options';
            $text .= "\n".trans('text.validate.'.$temp);
        }
        if ($question->cascade) {
            $text .= "\n".trans('text.cascade');
            $level = $question->input ? Arr::last(explode('|', $question->input)) : 0;
            $flow = new AkvoFlow();
            $cascade = $flow->getCascade($question->cascade, $level);
            $i = 0;
            do {
                $id = $cascade[$i]['id'];
                $opt = $cascade[$i]['name'];
                $text .= "\n".$opt." (".$id.")";
                $i++;
            } while($i < count($cascade));
        }
        return $text;
    }

    public function validator($question, $answer)
    {
        $validate = false;
        if (Str::lower($question->type) === 'numeric') {
            $validate = is_numeric($answer);
            return !$validate;
        }

        if (Str::lower($question->type) === 'option') {
            if (!is_numeric($answer) || $answer === "0") {
                return true;
            }
            $options = Str::of($question->text)->explode(PHP_EOL);
            $validate = isset($options[$answer]);
            return !$validate;
        }

        if ($question->cascade) {
            $level = $question->input ? Arr::last(explode('|', $question->input)) : 0;
            $flow = new AkvoFlow();
            $cascade = collect($flow->getCascade($question->cascade, $level));
            $validate = $cascade->contains('id', (int) $answer);
            return !$validate;
        }

        return $validate;
    }
}
