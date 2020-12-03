<?php

namespace App\Helpers;

use Illuminate\Support\Str;

class Mails {

    public function sendEmail($recipients, $endpoint, $subject, $body, $text) {
        $mj = new \Mailjet\Client(
            env('MAILJET_APIKEY'), 
            env('MAILJET_APISECRET'), 
            true,
            ['version' => 'v3']
        );
        $body = [
            'FromName' =>  config('mail.from.name'),
            'FromEmail' =>  config('mail.from.address'),
            'Subject' => $subject,
            'Html-part' => "
                $body <p><a href='$endpoint'>$endpoint</a></p>
            ",
            'Text-part' => "$text $endpoint",
            'Recipients' => $recipients
        ];
        $result = false;
        $response =  $mj->post(\Mailjet\Resources::$Email, ['body' => $body]);
        return $response->getData();
    }
}
