<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use \Mailjet\Resources;
use Mailjet\LaravelMailjet\Facades\Mailjet;

class SupportController extends Controller
{
    //
    public function send(Request $request)
    {
        /**
         * Rules for captcha
         *
         * */
        // $rules = ['captcha' => 'required|captcha'];
        // $validator = validator()->make(request()->all(), $rules);
        // if ($validator->fails()) {
        //     return view('frames.frame-support', ['status' => 'invalid']);
        // }

        $mails = explode(',', config('mail.recipients'));
        $recipients = collect();
        collect($mails)->each(function ($mail) use ($recipients) {
            $recipients->push(['Email' => $mail]);
        });
        $recipients->push(['Email' => $request->email]);

        $mj = Mailjet::getClient();
        $body = [
            'FromEmail' => config('mail.host'),
            'FromName' => config('mail.host'),
            'Subject' => $request->subject,
            'Html-part' => "
                <p>Hi, I'm $request->name</p>
                <p>Email: $request->email</p>
                <p>Message: $request->message</p>
            ",
            'Recipients' => $recipients
        ];

        $result = false;
        try {
            $response =  $mj->post(Resources::$Email, ['body' => $body]);
            $result = $response->success();
        } catch (\Exception $e) {
            logger()->error('Goutte client error ' . $e->getMessage());
        }

        return view('frames.frame-support', ['status' => $result]);
    }
}
