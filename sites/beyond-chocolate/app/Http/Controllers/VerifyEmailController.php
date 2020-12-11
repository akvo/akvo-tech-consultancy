<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controller;
use App\Models\User;

class VerifyEmailController extends Controller
{
    /**
     * Override original EmailVerifyController
     */
    public function __invoke(Request $request): RedirectResponse
    {
        //takes user ID from verification link. Even if somebody would hijack the URL, signature will be fail the request
        $user = User::find($request->route('id')); 

        if ($user->hasVerifiedEmail()) {
            return redirect()->intended(config('fortify.home') . '?verified=1');
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }
        
        $message = __('Your email has been verified.');

        //if user is already logged in it will redirect to the dashboard page
        return redirect('login')->with('status', $message); 
    }
}
