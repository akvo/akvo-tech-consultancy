<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Collection;
use Illuminate\Http\Request;
use App\Http\AkvoFlow;
use App\SurveySession;

class GatewayController extends Controller
{
    function incoming(Request $request, SurveySession $survey_sessions)
    {
        $response = "CON ";
        $session = $survey_sessions->where('phone_number', $request->phoneNumber)->first();
        $continue = false;

        $start = $request->text === NULL ? true : false;
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
            $response .= "1. Yes\n2. No";
            return $response;
        }

        if ($step_first && $session) {
            $continue = $request->text === "1" ? true : false;
        }

        /*
         * Match input to the pending session 
         * if decide to continue
         */
        if ($continue) {
            $input_codes = explode('*', $session->input_code);
        }

        /*
         * Destroy the old session
         * if decide not to continue
         */
        if (!$continue && $session) {
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
            return $response.$options;
        }

        /*
         * Ask Form ID, the first step
         * if doesn't have pending session
         */
        $instance_name = config('akvoflow.instances')[(int) $input_codes[0] - 1];
        if($step_first && !$session){
            $response .= "Instance Name: ".$instance_name."\n";
            $response .= "Please input the Form ID (e.g 293680912)\n";
            return $response;
        }

        /*
         * Ask Enumerator Name, the second step
         * if doesn't have pending session
         */
        $step_second = count($input_codes) === 2 ? true : false;
        if($step_second && !$session){
            $response .= "Enumerator Name\n";
            return $response;
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
            return $survey_session;
        }

        return $survey;
    }

}
