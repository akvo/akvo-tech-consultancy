<?php

namespace App\Interact;

use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Support\Collection;
use App\Http\AkvoFlow;
use App\Interact\Submission;
use App\Localization;
use App\SurveySession;
use App\Answer;
use Illuminate\Support\Facades\Cache;

class Feed
{
    function __construct($prefix, $prefix_end, $kind, $log)
    {
        $this->prefix = $prefix;
        $this->prefix_end = $prefix_end;
        $this->kind = $kind;
        $this->log = $log;
    }

    public function show_last_question($session) {
        $current = $session->pending_answer()->first();
        $current = $session->check_lang($current);
        return $this->formatter($current);
    }

    public function continue_survey($value, $session) {
        $current = $session->pending_answer()->first();
        $current = $session->check_lang($current);

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

        /**
         * Dependency question
         */
        $answer = '';
        if ($current->type === "option") {
            // get the original answer value (not translate)
            $original = Answer::find($current->id);
            $text = Str::of($original->text)->explode(PHP_EOL);
            $dependencyTmp = collect();
            if (Cache::get('dependency_'.$session['id'])) {
                $dependencyTmp = Cache::get('dependency_'.$session['id']);
            }
            $answer = Str::of($text[(int)$value])->after(' ');
            $findDependency = Answer::where('dependency', $current->question_id)
                                    ->where('dependency_answer', $answer)
                                    ->pluck('dependency')->unique();
            $findDependency->each(function($id) use ($dependencyTmp, $answer) {
                $dependencyTmp->push([
                    "question_id" => $id,
                    "answer" => $answer,
                ]);
            });
        }
        if ($current->type === "option" && $findDependency->isNotEmpty()) {
            Cache::put('dependency_'.$session['id'], $dependencyTmp);
        }

        /*
         * Update Current Answer
         */
        if ($current->type !== "cascade") {
            $current->input = $value;
            $current->waiting = false;
            $current->save();
        }

        /*
         * Get Next Question
         */

        $next = $session->answers()->find($current->id + 1);
        // Check dependency question
        do {
            if (isset($next->dependency) && $next->dependency) {
                $stop = false;
                $depend = Cache::get('dependency_'.$session['id']);
                if (!$depend) {
                    $stop = true;
                    $checkDepend = collect();
                }
                if ($depend) {
                    $checkDepend = $depend->filter(function($item) use ($next) {
                        if ($item['question_id'] == $next->dependency && $item['answer'] == $next->dependency_answer) {
                            return $item;   
                        }
                    });
                }
                if ($checkDepend->isEmpty()) {
                    $next = $session->answers()->find($next->id + 1);
                } else {
                    $next = $next;
                    $stop = true;
                }
            } else {
                $stop = true;
            }
        } while(!$stop);
        $next = $session->check_lang($next);

        if (!$next) {
            Cache::forget('dependency_'.$session['id']);
            Cache::forget('select_language_'.$session['id']);
            $submission = new Submission();
            $submission->send($session->id);
            $this->log->info($this->kind.$session->phone_number.": End of Survey");
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
        $version = $survey['version'];
        $isObject = Arr::has($survey["questionGroup"], "question");
        if ($isObject) {
            $heading = $survey["questionGroup"]["heading"];
            $questions = collect($survey["questionGroup"]["question"])
                ->map(function($question) use ($heading, $version) {
                    return $this->generate_question($question, $version);
            });
        }
        if (!$isObject) {
            $questions = collect($survey["questionGroup"])->map(function($group) use ($version){
                return collect($group["question"])->map(function($question) use ($version) {
                    return $this->generate_question($question, $version);
                })->toArray();
            })->flatten(1);
        }
        $questions = $session->answers()->createMany($questions->toArray());
        $current = $questions->first();
        $current->waiting = true;
        $current->save();

        // check and select avaliable lang
        $sess = new SurveySession();
        $results = $sess->fetch_lang($session);
        $avaLang = $this->mapLanguage($results);
        if ($avaLang->isNotEmpty() &&  !$avaLang->contains($session->default_lang)) {
            // ask lang selection to user
            $avaLang->push($session->default_lang);
            Cache::put('select_language_'.$session['id'], true);
            return $this->ask($session, $avaLang, true);
        }

        $response = $this->formatter($current);
        return $response;
    }

    public function mapLanguage($data)
    {
        return collect($data['answers'])->map(function ($answer) use ($data) {
            return $answer['localizations']->map(function ($lang) use ($data) {
                return $lang['lang'];
            });
        })->flatten()->unique();
    }

    public function generate_question($question, $version) {
        if (Arr::has($question, "validationRule")) {
            $question['type'] = $question['validationRule']['validationType'];
        }
        $options = "";
        $cascade = null;
        $cascade_lv = null;
        if (Arr::has($question, "options")) {
            $options .= $this->generateOptionText($options, $question);
        }
        if ($question['type'] === "cascade") {
            $cascade = $question["cascadeResource"];
            $cascade_lv = count($question["levels"]["level"]);
        }
        $dependency = null;
        $dependency_answer = null;
        if(isset($question['dependency'])) {
            $dependency = $question['dependency']['question'];
            $dependency_answer = $question['dependency']['answer-value'];
        }
        $format = array(
            'question_id' => (int) $question['id'],
            'order' => (int) $question['order'],
            'mandatory' => (int) $question['mandatory'],
            'datapoint' => $question['localeNameFlag'],
            'text' => $question['text'].$options,
            'type' => $question['type'],
            'cascade' => $cascade,
            'cascade_lv' => $cascade_lv,
            'dependency' => $dependency,
            'dependency_answer' => $dependency_answer
        );
        // check translation
        if (Arr::has($question, "altText")) {
            $isObject = Arr::has($question['altText'], "language");
            if ($isObject) {
                $this->fillLocalization(
                    $question,
                    $version,
                    $question['altText']['language'],
                    $question['altText']['text'] 
                );
            }
            if (!$isObject) {
                collect($question['altText'])->each(function ($lang) use ($question, $version) {
                    $this->fillLocalization(
                        $question,
                        $version,
                        $lang['language'],
                        $lang['text'] 
                    );
                });
            }
        }
        return $format;
    }

    public function generateOptionText($options, $question, $lang=false)
    {
        $opt = $question["options"]["option"];
        $i = 1;
        do {
            $icode = (string) $i;
            if (Arr::has($opt[$i - 1], "code")) {
                $icode = $opt[$i - 1]["code"];
                $icode = strtoupper($icode);
            }
            if (!Arr::has($opt[$i - 1], "altText") || !$lang) {
                $options .= "\n".$icode.". ".$opt[$i - 1]["text"];
            }
            if (Arr::has($opt[$i - 1], "altText") && $lang) {
                $isObject = Arr::has($question['altText'], "language");
                if ($isObject && $question['altText']["language"] == $lang) {
                    $options .= "\n".$icode.". ".$opt[$i - 1]["altText"]["text"];
                }
                if (!$isObject) {
                    $tmp = collect($opt[$i - 1]["altText"])->where('language', $lang)->first();
                    $options .= "\n".$icode.". ".$tmp["text"];
                }
            }
            $i++;
        } while($i <= count($opt));
        return $options;
    }

    public function fillLocalization($question, $version, $lang, $text)
    {
        $check = Localization::where('question_id', (int) $question['id'])
                            ->where('version', $version)
                            ->where('lang', $lang)
                            ->count();
        if ($check === 0) {
            $langOptions = "";
            if (Arr::has($question, "options")) {
                $langOptions = $this->generateOptionText($langOptions, $question, $lang);
            }
            $insert = Localization::create([
                'question_id' => (int) $question['id'],
                'version' => $version,
                'text' => $text.$langOptions,
                'lang' => $lang
            ]);
            $insert->save();
        }
        return;
    }

    public function ask($session, $options=false, $lang=false, $repeat=false)
    {
        $response = $this->prefix;
        if ($repeat) {
            $response .= "\n".trans('text.validate.options')."\n";
        }
        if (!$lang) {
            $response .= trans('text.ask.hi', ['phone' => $session->phone_number])."\n";
            $response .= trans('text.ask.info', ['name' => $session->form_name])."\n";
            $response .= trans('text.ask.continue')."\n";
        }
        if ($lang) {
            $response .= "Select language:";   
        }
        if ($options) {
            $i = 0;
            $response .= "\n";
            do {
                $id = $i + 1; 
                $text = ($lang) ? config('localizations.'.$options[$i].'').' ('.$options[$i].')' : $options[$i];
                $response .= $id.". ".$text."\n";
                $i++;
            } while ($i < count($options));
            return $response;
        }
        if (!$lang) {
            $response .= trans('text.ask.response.y')."\n".trans('text.ask.response.n');
        }
        return $response;
    }

    public function destroy($session)
    {
        Cache::forget('dependency_'.$session['id']);
        Cache::forget('select_language_'.$session['id']);
        $session->delete();
        $response = $this->prefix_end.trans('text.destroy.success')."\n";
        $response .= trans('text.destroy.info')."\n";
        return $response;
    }

    public function formatter($question, $repeat=false)
    {
        $text = $this->prefix;
        if ($repeat) {
            $temp = (Str::lower($question->type) === 'numeric') ? 'numeric' : 'options';
            $text .= "\n".trans('text.validate.'.$temp)."\n";
            $this->log->info("Repeat Question");
        }
        $text .= $question->text;
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
