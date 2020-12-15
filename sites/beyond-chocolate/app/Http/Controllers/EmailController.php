<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \Mailjet\Resources;
use \Mailjet\LaravelMailjet\Facades\Mailjet;
use App\Helpers\Mails;

/**
 * Need to change this email into new mail helpers
 */

class EmailController extends Controller
{
    public function sendFeedback(Request $request, Mails $mails)
    {
        $footer = "GISCO Monitoring Pilot for 2019 data"; 
        $recipients = config('mail.mailing.list');
        $recipients = collect($recipients)->map(function($address){
            return [
                'Email' => $address
            ];
        })->push(['Email' => $request->email]);
        $subject = $request->subject;
        $body = "Feedback from: <strong>$request->email</strong><br/><br/>
                $request->message <hr/>
                <strong>SENT VIA <a href='".env('APP_URL')."'>".$footer."</a></strong>
                <br/>";
        $text = "Feedback from: $request->email";
        $response = $mails->sendEmail($recipients, false, $subject, $body, $text);
        
        return response([
            'message' => 'Your feedback has been sent!', 'mails' => $response
        ]);
    }
    //
    public function informUser(Request $request, Mails $mails)
    {
        $footer = "GISCO Monitoring Pilot for 2019 data";
        $recipients = [['Email' => $request->email, 'Name' => $request->name]];
        $subject = $request->subject;
        $questionnaires = array_map(function($q){return '<li>' . $q . '</li>';}, $request->questionnaires);
        $questionnaires = implode("\n", $questionnaires);
        $body = "Hi $request->name<br/><br/>
                $request->adminName from $request->adminOrg has assigned you the following surveys in the GISCO monitoring pilot for 2019 data portal for your input
                <ul>
                $questionnaires
                </ul>
                $request->message
                <strong>Please visit <a href='".env('APP_URL')."'>".$footer."</a> to fill in your data.</strong><br/>
                Incase of any issue please contact $request->adminName directly or use the feedback form on the portal.<br/>";
        $text = "$request->adminName from $request->adminOrg has assigned surveys in the GISCO monitoring pilot for 2019 data portal for your input";
        $response = $mails->sendEmail($recipients, false, $subject, $body, $text);

        return response([
            'message' => 'The user has been informed!', 'mails' => $response
        ]);
    }

}
