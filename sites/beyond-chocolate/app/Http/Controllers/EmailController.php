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
    public function send(Request $request, Mails $mails)
    {
        $recipients = config('mail.mailing.list');
        $recipients = collect($recipients)->map(function($address){
            return [
                'Email' => $address
            ];
        })->push(['Email' => $request->email]);
        $subject = $request->subject;
        $body = "Feedback from: <strong>$request->email</strong><br/><br/>
                $request->message <hr/>
                <strong>SENT VIA <a href='".env('APP_URL')."'>Cacao - Beyond Chocolate</a></strong>
                <br/>";
        $text = "Feedback from: $request->email";
        $response = $mails->sendEmail($recipients, false, $subject, $body, $text);
        
        return response([
            'message' => 'Your feedback has been sent!', 'mails' => $response
        ]);

        // old way
        // $mailjet = Mailjet::getClient();
        // $body = [
        //     'FromEmail' => config('mail.mailing.host'),
        //     'FromName' => config('mail.mailing.host'),
        //     'Subject' => $request->subject,
        //     'Html-part' => "Feedback From: <strong>$request->email</strong><br/><br/>
        //         $request->message <hr/>
        //         <strong>SENT VIA
        //         <a href='".env('APP_URL')."'>Cacao - Beyond Chocolate</a></strong>
        //         <br/>",
        //     'Recipients' => $recipients
        // ];

        // $response = false;
        // try {
        //     $response =  $mailjet->post(Resources::$Email, ['body' => $body]);
        //     $response = $response->success();
        // } catch (\Exception $e) {
        //     logger()->error('Goutte client error ' . $e->getMessage());
        // }
        // return ['sent' => $response];

    }
    //
}
