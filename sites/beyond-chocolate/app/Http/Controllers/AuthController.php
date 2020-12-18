<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Helpers\Mails;
use Carbon\Carbon;
use App\Http\Controllers\AuthenticatedSessionController;
use Illuminate\Contracts\Auth\StatefulGuard;

class AuthController extends Controller
{
    public function forgotPassword(Request $request, Mails $mails)
    {
        $user = \App\Models\User::where('email', $request->email)->first();
        if ($user) {
            $token = Str::random(50);
            $user->update([
                'email_verified_at' => now(),
                'remember_token' => $token
            ]);
            $recipients = [['Email' => $user->email, 'Name' => $user->name]];
            $endpoint = config('app.url') . '/reset-password/'  .$token;
            $subject = config('app.name').": Reset Password";
            $body = "Hi $user->name, <p>Please open the link below to change your password.</p>";
            $text = "Hi $user->name, Please open the link below to change your password";
            $response = $mails->sendEmail($recipients, $endpoint, $subject, $body, $text);
    
            return response([
                'message' => 'Hi ' .$user->name.', please check your email', 'mails' => $response
            ]);
        }

        return response(["message" => "User not found"], 401);
    }
    
    public function resetPassword(Request $request)
    {
        $request->validate([
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'password_confirmation' => ['required', 'string']
        ]);        
        $user = \App\Models\User::where('remember_token', $request->token)->first();
        if ($user) {
            $user->update([
                'password' => Hash::make($request->password),
                'remember_token' => Str::random(50)
            ]);
    
            return response([
                'message' => 'Hi ' .$user->name.', your password has been changed, redirecting page.'
            ]);
        }

        return response(["message" => "User with this email not found"], 401);
    }

    public function update(Request $request)
    {
        $validate = $request->validate([
            'password' => 'required',
            'new_password' => ['required_with:new_password_confirmation', 'same:new_password_confirmation', 'string', 'min:8'],
        ]);

        if (!Auth::user()) {
            return response(['message' => 'session is expired'], 401);
        }

        $user = \App\Models\User::where('id', Auth::user()->id)->first();
        $valid = Hash::check($request->password, $user->password);
        if($valid){
            $password = Hash::make($request->new_password);
            $user->update(['password' => $password]);
            return response([
                'message' => 'Your password has been updated.'
            ]);
        };
        return response(['message' => 'Invalid password'], 401);
    }

    public function checkLastActivity(Request $request, StatefulGuard $guard)
    {
        $user = $request->user();
        /**
         * Check user last activity (2 hours)
         */
        $last_activity = new Carbon($user->last_activity);
        $date = new Carbon();
        $dateNow = $date->now();
        $diff = $dateNow->diff($last_activity);

        if ($diff->h >= 2 || is_null($user->last_activity)) {
            $session = new AuthenticatedSessionController($guard);
            $logout = $session->destroy($request);
            return $user->last_activity;
        }

        /**
         * Update last activity if less than 2 hours
        */
        $user->last_activity = now();
        $user->save();
        return $user->last_activity;
        /**
         * if last activity null, user must be redirect to login page
         */
    }
}
