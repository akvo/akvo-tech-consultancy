<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Mail\Events\MessageSent;
use Illuminate\Support\Facades\Log;
use App\Models\User;

class LogSentMessage
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
     * @param  object  $event
     * @return void
     */
    public function handle(MessageSent $event)
    {
        //
        $subject = $event->data['subject'];
        $url = $event->data['displayableActionUrl'];
        $userId = explode('/', $url)[5];
        $user = User::find($userId);
        Log::channel('email')->info('User: '.$user->email.' | Email subject: '.$subject.' | Link: '.$url);
    }

    public function failed(MessageSent $event, $exception)
    {
        //
        $subject = $event->data['subject'];
        $url = $event->data['displayableActionUrl'];
        $userId = explode('/', $url)[5];
        $user = User::find($userId);
        Log::channel('email')->error('User: '.$user->email.' | Email subject: '.$subject.' | Link: '.$url);
    }
}
