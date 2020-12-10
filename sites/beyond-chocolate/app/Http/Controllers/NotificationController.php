<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Akvo\Api\FlowApi;
use Akvo\Api\Auth;
use Carbon\Carbon;
use App\Helpers\Mails;

class NotificationController extends Controller
{
    public function projectNotification(Request $request, Auth $auth, Mails $mails)
    {
        $config = config('webform.surveys');
        $endpoint = env('AKVOFLOW_API_URL');
        $endpoint .= '/'.env('AKVOFLOW_INSTANCE').'/form_instances';
        $now = Carbon::now()->format('Y-m-d');
        $api = new FlowApi($auth);

        $collections = collect();
        foreach ($config['project'] as $key => $cfg) {
            $endpoint .= '?survey_id='.$cfg['survey_id'];
            $endpoint .= '&form_id='.$cfg['form_id'];
            $data = $this->fetchAll($api, $endpoint, collect([]));
            $data = $data->flatten(1);
            if (count($data) === 0) {
                continue;
            };

            /**
             * TODO : Repeatable question as an array, if repeated that will contains array size more than 1 for that question group answer
             * qgid => [
             *      [
             *          qid: [ text: answer ], option answer / cascade
             *          qid: answer - free text / number
             *      ],
             *      [ ...answer ]
             * ]
             * Need to filter response by today date
             * Need to collect the email data from form instance response
             * Send email to response contact person
             */

            // Filter data response by todat date
            $data = $data->filter(function ($val) use ($now) {
                return $this->checkDate($val['submissionDate'], $now);
            });
            if (count($data) === 0) {
                continue;
            };

            // Collect the email data
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
                        "recipients" => ["Email" => trim($contact_email), "Name" => trim($contact_name)],
                        "comment" => trim($comment),
                    ];
                });
                return $response;
            })->flatten(1);
            $collections->push($emailData);
        }

        // Send email
        $results = $collections->flatten(1)->map(function ($emailData) use ($mails) {
            $emailData = collect($emailData);
            return $this->sendEmail($emailData, $mails);
        });

        return $results;
    }

    private function getResponse($value)
    {
        //
    }

    private function checkDate($date, $now)
    {
        // parse submission date (string) here
        $date = new Carbon($date);
        $date = $date->format('Y-m-d');
        return $date === $now;
    }

    private function sendEmail($emailData, $mails)
    {
        $footer = "GISCO Monitoring Pilot for 2019 data"; 
        $recipients = $emailData->get('recipients');
        $subject = 'Notification';
        $body = "Test notification <br/><br/>
                ".$emailData->get('comment')." <hr/>
                <strong>SENT VIA <a href='".env('APP_URL')."'>".$footer."</a></strong>
                <br/>";
        $text = "Notification email";
        $response = $mails->sendEmail($recipients, false, $subject, $body, $text);
        $response = ($response === null) ? "Failed to sent email" : $response;
        return $response;
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
