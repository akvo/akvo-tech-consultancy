<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use App\Helpers\Mails;

class AuthController extends Controller
{
    public function forgotPassword(Request $request, Mails $mails)
    {
        $user = \App\Models\User::where('email', $request->email)->first();
        if ($user) {
            $token = Str::random(60);
            $user->update([
                'email_verified_at' => now(),
                'remember_token' => $token
            ]);
            $recipients = [['Email' => $user->email, 'Name' => $user->name]];
            $endpoint = config('app.url') . '/reset-password/'  .$token;
            $subject = "IDH Beyond Chocolate: Create New Password";
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
                'remember_token' => Str::random(60)
            ]);
    
            return response([
                'message' => 'Hi ' .$user->name.', your password has been changed, redirecting page.'
            ]);
        }

        return response(["message" => "User not found"], 401);
    }
}
