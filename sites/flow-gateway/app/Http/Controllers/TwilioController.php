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
        $kind = "Twilio - ";
        $log = Log::channel('twilio');
        $feed = new Feed("","", $kind, $log);
        $text = $request->answer;
        $init = Str::contains($text,'#');
        $info = false;
        $session = false;
        $first = in_array(strtolower($text),config('twilio.welcome'));
        $response = trans('text.welcome')."\n\n";

        if ($first) {
            /*
             * User first message
             */
            $response .= trans('text.start.info')."\n\n";
            $response .= trans('text.start.format')."\n";
            $response .= "(e.g *seap#293680912*)\n";
            $log->info($kind.$request->phone_number.": Welcome");
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
            $response .= trans('text.session.info');
            $response .= trans('text.session.remove');
            $response .= "\n\n*DELETE SESSION*\n\n";
            $response .= trans('text.session.show');
            $response .= "\n\n*SHOW QUESTION*\n";
            $log->info($kind.$request->phone_number.": Info");
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
            $response .= trans('text.session.restart');
            $response .= trans('text.start.info')."\n\n";
            $response .= trans('text.start.format')."\n";
            $response .= "(e.g *seap#293680912)\n";
            $log->info($kind.$request->phone_number.": Destroy");
            return $response;
        }
        if ($session && strtolower($text) === "show question") {
            /*
             * User want to show the last question
             */
            $log->info($kind.$request->phone_number.": Continue Survey");
            return $feed->show_last_question($session);
        }
        if ($session) {
            /*
             * User answering question;
             */
            $log->info($kind.$request->phone_number.": Next Question");
            return $feed->continue_survey($text, $session);
        }
        if (!$session) {
            $survey = $flow->getForm($info[0], $info[1]);
            $input = collect($request)
                ->put('form_name', $survey['surveyGroupName'])
                ->put('version', $survey['version'])
                ->put('app', $survey['app'])
                ->put('instance_name', $info[0])
                ->put('form_id', (int) $info[1])
                ->forget(['answer','media'])
                ->toArray();
            $session = $survey_sessions->insertGetId($input);
            $session = $survey_sessions->find($session);
            $log->info($kind.$request->phone_number.": Init");
            return $feed->store_questions($survey, $session);
        }
        $log->info($kind.$request->phone_number.": Error Input");
        return $text;
    }
}
