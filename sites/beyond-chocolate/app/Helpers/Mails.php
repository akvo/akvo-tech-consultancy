<?php

namespace App\Helpers;

use Illuminate\Support\Str;

class Mails {

    public function sendEmail($recipients, $endpoint, $subject, $body, $text)
    {
        $mailjet = new \Mailjet\Client(
            env('MAILJET_APIKEY'),
            env('MAILJET_APISECRET'),
            true,
            ['version' => 'v3']
        );

        $link = "";
        $link_text = "";
        if ($endpoint !== false) {
            $link = "<p><a href='$endpoint'>$endpoint</a></p>";
            $link_text = "";
        }

        $body = [
            'FromName' => config('mail.from.name'),
            'FromEmail' => config('mail.from.address'),
            'Subject' => $subject,
            'Html-part' => "
                $body $link
            ",
            'Text-part' => "$text $link_text",
            'Recipients' => $recipients
        ];
        
        $response = $mailjet->post(\Mailjet\Resources::$Email, ['body' => $body]);
        return $response->getData();
    }

}