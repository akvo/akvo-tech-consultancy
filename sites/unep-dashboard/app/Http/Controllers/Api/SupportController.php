<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use \Mailjet\Resources;
use \Mailjet\LaravelMailjet\Facades\Mailjet;

class SupportController extends Controller
{

    public function send(Request $request)
    {

        $recipients = config('mail.mailing.list');
        $recipients = collect($recipients)->map(function($address){
            return [
                'Email' => $address
            ];
        })->push(['Email' => $request->email]);
        $mailjet = Mailjet::getClient();
        $body = [
            'FromEmail' => config('mail.host'),
            'FromName' => config('mail.host'),
            'Subject' => $request->subject,
            'Html-part' => "
                Support Request From: <strong>$request->email</strong><br/><br/>
                $request->message <hr/>
                <strong>SENT VIA
                <a href='https://unep.tc.akvo.org'>UNEP STOCKTACKING DATA PORTAL</a></strong>
                <br/>
            ",
            'Recipients' => $recipients
        ];
        $response = false;
        try {
            $response =  $mailjet->post(Resources::$Email, ['body' => $body]);
            $response = $response->success();
        } catch (\Exception $e) {
            logger()->error('Goutte client error ' . $e->getMessage());
        }
        return ['sent' => $response];

    }

}
