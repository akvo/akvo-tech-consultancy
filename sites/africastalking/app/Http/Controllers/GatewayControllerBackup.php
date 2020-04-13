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
    function incoming(Request $request, SurveySession $survey_session, AkvoFlow $flow)
    {
        $answer = explode('*', $request->text);
        $init = count($answer) === 1 ? true : false;
        $init = $request->text === null ? false : $init;
        $register_device = count($answer) === 2 ? true : false;
        $start_session = count($answer) === 3 ? true : false;

        $response = "CON ";
        $phone_number = (int) $request->phoneNumber;

        $session = $survey_session
            ->where('phone_number', $phone_number)
            ->first();

        $continue = $request->text === "1" ? true : false;

        if ($session && $continue) {
            return "continue session";
        }

        if ($session && !$init) {
            $response .= "Hi ".$session->enumerator."\n";
            $response .= "You haven't finished the ".$session->form_name." survey\n";
            $response .= "Would you like to continue?\n";
            $response .= "1. Yes\n2. No";
            return $response;
        }

        if(!$init){
            $instances = config('akvoflow.instances');
            $response .= "What is your instance name?\n";
            $options = collect($instances)->map(function($option, $index) {
                $index += 1;
                $option = $index.' '.$option;
                return $option;
            })->join("\n", "");
            return $response.$options;
        }

        if($init){
            $instance_id = (int) $answer[0];
            $instance_name = config('akvoflow.instances')[$instance_id];
            $response .= "Instance Name: ".$instance_name."\n";
            $response .= "Please input the Form ID (e.g 293680912)\n";
            return $response;
        }

        $form_id = $answer[1];

        if($register_device){
            $response .= "Enumerator Name\n";
            return $response;
        }

        if($save_session){
            $survey = $flow->getForm($instance_name, $form_id);
            $new_session = array(
                'session_id' => $request->sessionId,
                'instance_name' => $instance_name,
                'form_id' => (int) $form_id,
                'form_name' => $survey['surveyGroupName'],
                'version' => $survey['version'],
                'phone_number' => $phone_number,
                'enumerator' => $answer[2],
                'input_code' => $request->text,
            );
            $survey_session = $survey_session->insert($new_session);
            if ($survey_session)
            {
                return $new_session;
            };
        }

        return "delete session";
    }

}
