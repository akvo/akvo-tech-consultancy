<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Http\Request;
use App\Http\AkvoFlow;
use App\SurveySession;
use App\Answer;

class GatewayController extends Controller
{
    function incoming(Request $request, SurveySession $survey_sessions)
    {
        $response = "CON ";
        $session = $survey_sessions->where('phone_number', $request->phoneNumber);
        $session = $session->first();
        $continue = false;
        $start = $request->text === NULL ? true : false;
        $last_input = 0;
        $input_codes = explode('*', $request->text);
        $step_first = count($input_codes) === 1 ? true : false;

        /*
         * Ask to continue or not, the starting point
         * if has pending session
         */
        if ($start && $session) {
            $response .= "Hi ".$session->enumerator."\n";
            $response .= "You haven't finished the ".$session->form_name." survey\n";
            $response .= "Would you like to continue?\n";
            $response .= "Yes (Y) \nNo (N)";
            return $response;
            return response($response, 200)->header('Content-Type', 'text/plain');
        }

        /*
         * Match input to the pending session 
         * if decide to continue
         */

        if ($session || $input_codes[0] === "Y") {
            $continue = true;
        }

        if ($session && $input_codes[0] === "N") {
            $continue = false;
        }

        if ($continue) {
            if (count($input_codes) > 1) {
                return $this->continue_survey($input_codes, $session);
            }
            if (count($input_codes) === 1) {
                $current = $session->pending_answer()->first();
                $response = $this->formatter($current);
                return response($response, 200)->header('Content-Type', 'text/plain');
            }
        }

        /*
         * Destroy the old session
         * session is continuing
         * if decide not to continue
         */
        if (!$continue && $session) {
            $session->delete();
            $response .= "Your previous incomplete submission has been deleted\n";
            $response .= "Please redial the number to start a new submission\n";
            return response($response, 200)->header('Content-Type', 'text/plain');
        }

        /*
         * Ask instance name, the starting point
         * if doesn't have pending session
         */
        if($start && !$session){
            $instances = config('akvoflow.instances');
            $response .= "What is your instance name?\n";
            $options = collect($instances)->map(function($option, $index) {
                $index += 1;
                $option = $index.' '.$option;
                return $option;
            })->join("\n", "");
            return response($response.$options, 200)->header('Content-Type', 'text/plain');
        }

        /*
         * Ask Form ID, the first step
         * if doesn't have pending session
         */
        $instance_name = config('akvoflow.instances')[(int) $input_codes[0] - 1];
        if($step_first && !$session){
            $response .= "Instance Name: ".$instance_name."\n";
            $response .= "Please input the Form ID (e.g 293680912)\n";
            return response($response, 200)->header('Content-Type', 'text/plain');
        }

        /*
         * Ask Enumerator Name, the second step
         * if doesn't have pending session
         */
        $step_second = count($input_codes) === 2 ? true : false;
        if($step_second && !$session){
            $response .= "Enumerator Name\n";
            return response($response, 200)->header('Content-Type', 'text/plain');
        }

        /*
         * Save session, the third step
         * if doesn't have pending session
         */
        $step_third = count($input_codes) === 3 ? true : false;
        $form_id = $input_codes[1];
        $enumerator = $input_codes[2];
        $flow = new AkvoFlow();
        $survey = $flow->getForm($instance_name, $form_id);
        if($step_third && !$session){
            $session = array(
                'session_id' => $request->sessionId,
                'instance_name' => $instance_name,
                'form_id' => (int) $form_id,
                'form_name' => $survey['surveyGroupName'],
                'version' => $survey['version'],
                'phone_number' => (int) $request->phoneNumber,
                'enumerator' => $enumerator,
                'input_code' => $request->text,
            );
            $session = $survey_sessions->insert($session);
            $session = $survey_sessions->where('phone_number', $request->phoneNumber)->first();
        }
        $response = $this->init_survey($survey, $last_input, $session);
        return response($response, 200)->header('Content-Type', 'text/plain');
    }

    private function init_survey($survey, $num, $session) {
        $questions;
        $isObject = Arr::has($survey["questionGroup"], "question");
        if ($isObject) {
            $heading = $survey["questionGroup"]["heading"];
            $questions = collect($survey["questionGroup"]["question"])->map(function($question) use ($heading) {
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
                $options .= "\n".$i.". ".$opt[$i - 1]["text"];
                $i++;
            } while($i < count($opt));
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
        $next->waiting = true;
        $next->save();
        if ($next) {
            $response = $this->formatter($next);
            return $response;
        }
        return "survey is finish";
    }

    private function formatter($question) {
        $text = "CON ";
        $text = $text.$question->text;
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
            return $text;
        }
        return $text;
    }

    private function validator($current, $value) {
        $type = $current->type;
        if ($type === "numeric") {
            return (int) $value;
        }
        if ($type === "option") {
            $valid = (int) $value;
            if ($valid) {
                $options = count(explode("\n", $current->text)) > $current ? true : false;
                return $options;
            }
            return $valid;
        }
    }

}
