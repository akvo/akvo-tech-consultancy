<?php

namespace App\Listeners;

use App\Helpers\Mails;
use Illuminate\Auth\Events\Registered;

class SendEmailUserSavedNotification
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  Registered  $event
     * @return void
     */
    public function handle(Registered $event)
    {
        // Send email to admin there is new user registered
        $recipients = config('mail.mailing.new_user_notif');
        $recipients = collect($recipients)->map(function($address){
            return [
                'Email' => $address
            ];
        });
        $subject = 'New User Registration';
        $footer = "GISCO Monitoring Pilot for 2019 data"; 
        $body = "User: ".$event->user->name."<br/>
                Organization: ".$event->user->organization->name."<br/>
                <hr/>
                <strong>SENT VIA <a href='".env('APP_URL')."'>".$footer."</a></strong>
                <br/>";
        $text = "Registration Notification";

        $mails = new Mails();
        $response = $mails->sendEmail($recipients, false, $subject, $body, $text);
        $response = ($response === null) ? "Failed to sent email" : $response;

        return $response;
    }
}
