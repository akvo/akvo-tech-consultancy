<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use App\Http\AkvoFlow;
use App\SurveySession;
use App\Answer;
use App\Interact\Feed;

class AfricasTalkingController extends Controller
{
    function __construct(Request $request, SurveySession $survey_sessions) {
        $this->prefix = "CON ";
        $this->prefix_end = "END ";
        $destroy = false;
    }

    public function index(Request $request, SurveySession $survey_sessions, AkvoFlow $flow)
    {
        $feed = new Feed($this->prefix,$this->prefix_end);
        if (!$request->record) {
            $survey = $flow->getForm($request->instance_name, $request->form_id);
            $input = collect($request)
                ->put('form_name', $survey['surveyGroupName'])
                ->put('version', $survey['version'])
                ->put('app', $survey['app'])
                ->forget(['record','answer'])
                ->toArray();
            $session = $survey_sessions->insertGetId($input);
            $session = $survey_sessions->find($session);
            return $feed->store_questions($survey, $session);
        }
        if ($request->record && !$request->answer) {
            return $feed->ask($request->record);
        }

        /*
         * User decide to continue or destroy the last session
         */

        $session = $survey_sessions
            ->where('phone_number', $request->phone_number)
            ->where('complete', false)
            ->first();
        if ($request->record && strtolower($request->answer) === "n") {
            return $feed->destroy($session);
        }
        if ($request->record && strtolower($request->answer) === "y") {
            $question = $session->pending_answer()->first();
            return $feed->formatter($question);
        }

        /*
         * User is continueing the survey
         */

        if ($request->record) {
            $codes = explode('*', $request->answer);
            $value = Arr::last($codes);
            return $feed->continue_survey($value, $session);
        }
        return $this->prefix.trans('text.error');
    }

}
