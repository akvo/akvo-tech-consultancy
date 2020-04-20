<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use App\Http\AkvoFlow;
use App\SurveySession;
use App\Answer;

class AfricasTalkingController extends Controller
{
    function __construct(Request $request, SurveySession $survey_sessions) {
        $this->prefix = "CON ";
        $this->prefix_end = "END ";
        $destroy = false;
    }

    public function index(Request $request, SurveySession $survey_sessions, AkvoFlow $flow)
    {
        if (!$request->record) {
            $survey = $flow->getForm($request->instance_name, $request->form_id);
            $input = collect($request)
                ->put('form_name', $survey['surveyGroupName'])
                ->put('version', $survey['version'])
                ->forget(['record','answer'])
                ->toArray();
            $session = $survey_sessions->insertGetId($input);
            $session = $survey_sessions->find($session);
            return $this->store_questions($survey, $session);
        }
        if ($request->record && !$request->answer) {
            return $this->ask($request->record);
        }

        /*
         * User decide to continue or destroy the last session
         */

        $session = $survey_sessions
            ->where('phone_number', $request->phone_number)
            ->where('complete', false)
            ->first();
        if ($request->record && strtolower($request->answer) === "n") {
            return $this->destroy($session);
        }
        if ($request->record && strtolower($request->answer) === "y") {
            $question = $session->pending_answer()->first();
            return $this->formatter($question);
        }

        /*
         * User is continueing the survey
         */

        if ($request->record) {
            $codes = explode('*', $request->answer);
            return $this->continue_survey($codes, $session);
        }
        return $this->prefix."error input, please recheck your input";
    }

    private function ask($record)
    {
        $response = $this->prefix."Hi ".$record->phone_number."\n";
        $response .= "You haven't finished the ".$record->form_name." survey\n";
        $response .= "Would you like to continue?\n";
        $response .= "Yes (Y) \nNo (N)";
        return $response;
    }

    private function destroy($session)
    {
        $session->delete();
        $response = $this->prefix_end."Your previous incomplete submission has been deleted\n";
        $response .= "Please redial the number to start a new submission\n";
        return $response;
    }

    private function continue_survey($codes, $session) {
        $value = Arr::last($codes);
        $current = $session->pending_answer()->first();

        /*
         * $validator = $this->validator($current, $value);
         */

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
        if (!$next) {
            $session->complete = true;
            $session->save();
            return $this->prefix_end."Thanks for completing the survey";
        }
        $next->waiting = true;
        $next->save();
        $response = $this->formatter($next);
        return $response;
    }

    private function store_questions($survey, $session) 
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
                $heading = $group['heading'];
                return collect($group["question"])->map(function($question) use ($heading) {
                    return $this->generate_question($question, $heading);
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

    private function generate_question($question, $heading) {
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
                $icode = $i;
                if (Arr::has($opt[$i - 1], "code")) {
                    $icode = $opt[$i - 1]["code"];
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
            'text' => $heading." - ".$question['text'].$options,
            'type' => $question['type'],
            'cascade' => $cascade,
            'cascade_lv' => $cascade_lv
        );
        return $format;
    }

    private function formatter($question)
    {
        $text = $this->prefix.$question->text;
        if ($question->cascade) {
            $text .= "\nType the code inside the Bracket";
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

}
