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
}
