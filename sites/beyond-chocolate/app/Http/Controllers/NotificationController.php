<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Akvo\Api\FlowApi;
use Akvo\Api\Auth;

class NotificationController extends Controller
{
    public function projectNotification(Request $request, Auth $auth)
    {
        $config = config('webform.surveys');
        $endpoint = env('AKVOFLOW_API_URL');
        $endpoint .= '/'.env('AKVOFLOW_INSTANCE').'/form_instances';

        $api = new FlowApi($auth);
        foreach ($config['project'] as $key => $cfg) {
            $endpoint .= '?survey_id='.$cfg['survey_id'];
            $endpoint .= '&form_id='.$cfg['form_id'];
            $data = $this->fetchAll($api, $endpoint, collect([]));
            $data = $data->flatten(1);
            if (count($data) === 0) {
                continue;
            };
            // TODO : Repeatable question as an array, if repeated that will contains array size more than 1 for that question group answer
            /**
             * qgid => [
             *      [
             *          qid: [ text: answer ], option answer / cascade
             *          qid: answer - free text / number
             *      ],
             *      [ ...answer ]
             * ]
             * Need to filter response by today date
             * Need to collect the email data from form instance response
             */

            // Filter data response by todat date
            

            // collect the email data
            $emailData = $data->map(function ($val) use ($cfg) {
                $qcfg = $cfg['question'];
                $qgid = $qcfg['group'];
                // reject response if not match qgid from config
                $response = collect($val['responses'])->reject(function ($value, $key) use ($qgid) {
                    return (int) $key !== (int) $qgid;
                })->flatten(1)->values()->map(function ($r) use ($qcfg) {
                    $r = collect($r);
                    $member = $r->get($qcfg['member']);
                    $contact_name = $r->get($qcfg['contact_name']);
                    $contact_email = $r->get($qcfg['contact_email']);
                    $comment = $r->get($qcfg['comment']);
                    return [
                        // "member" => ($member !== null) ? $member['text'] : $member,
                        // "contact_name" => $contact_name,
                        // "contact_email" => $contact_email,
                        "member" => $member,
                        "recipients" => ["Email" => $contact_email, "Name" => $contact_name],
                        "comment" => $comment,
                    ];
                });
                return $response;
            })->flatten(1);
            dump($emailData);
        }
        return "Done";
    }

    private function getResponse($value)
    {
        //
    }

    private function fetchAll($api, $url, $data) {
        $response = $api->fetch($url);
        $data->push($response['formInstances']);
        if (isset($response['nextPageUrl'])) {
            $url = $response['nextPageUrl'];
            return $this->fetchAll($api, $url, $data);
        }
        return $data;
    }

    public function checkSurvey(Request $request, Auth $auth) 
    {
        $endpoint = env('AKVOFLOW_API_URL');
        $endpoint .= '/'.env('AKVOFLOW_INSTANCE').'/surveys/'.$request->survey_id;
        $api = new FlowApi($auth);
        return $api->fetch($endpoint);
    }
}
