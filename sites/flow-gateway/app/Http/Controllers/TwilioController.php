<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use App\Http\AkvoFlow;
use App\Interact\Feed;
use App\SurveySession;
use App\Answer;

class TwilioController extends Controller
{
    public function index(Request $request, AkvoFlow $flow, SurveySession $survey_sessions)
    {
        $feed = new Feed("","");
        $text = $request->answer;
        $init = Str::contains($text,'#');
        $info = false;
        $session = false;
        $first = in_array(strtolower($text),config('twilio.welcome'));
        $response = "Welcome to Akvo Flow Survey\n\n";

        if ($first) {
            /*
             * User first message
             */
            $response .= "Please reply with the following format to start new survey session:\n\n";
            $response .= "*INSTANCE_NAME#FORM_ID*\n";
            $response .= "(e.g *seap#293680912)\n";
            return $response;
        }
        if ($init) {
            /*
             * User first message
             */
            $info = explode('#',$request->answer);
            $init = count($info) === 2 ? true : false;
        }
        if ($init) {
            $session = $survey_sessions->check(
                $request->phone_number,
                $info[0],
                $info[1],
            );
        }
        if ($session && $init) {
            $response .= "You have the unfinished session, ";
            $response .= "If you wish to remove the session, please type:\n\n*DELETE SESSION*\n\n";
            $response .= "If you want to show the last question from the last session, please type:\n\n*SHOW QUESTION*\n";
            return $response;
        }

        $session = $survey_sessions
            ->where('complete', false)
            ->where('phone_number',$request->phone_number)
            ->first();
        if ($session && strtolower($text) === "delete session") {
            /*
             * User decide to remove the session
             */
            $response .= "Your session restarted, ";
            $response .= "please reply with the following format to start new survey session:\n\n";
            $response .= "*INSTANCE_NAME#FORM_ID*\n";
            $response .= "(e.g *seap#293680912)\n";
            return $response;
        }
        if ($session && strtolower($text) === "show question") {
            /*
             * User want to show the last question
             */
            return $feed->show_last_question($session);
        }
        if ($session) {
            /*
             * User answering question;
             */
            return $feed->continue_survey($text, $session);
        }
        if (!$session) {
            $survey = $flow->getForm($info[0], $info[1]);
            $input = collect($request)
                ->put('form_name', $survey['surveyGroupName'])
                ->put('version', $survey['version'])
                ->put('instance_name', $info[0])
                ->put('form_id', (int) $info[1])
                ->forget(['answer','media'])
                ->toArray();
            $session = $survey_sessions->insertGetId($input);
            $session = $survey_sessions->find($session);
            return $feed->store_questions($survey, $session);
        }
        return $text;
    }
}
