<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'email|required',
            'password' => 'required'
        ]);
        if (!Auth::attempt($credentials)) {
            return response(['message' => 'invalid login credentials'], 401);
        }
        Auth::user()->tokens->each(function($token, $key) {
            $token->delete();
        });
        $token = Auth::user()->createToken('authToken')->accessToken;
        $user = \App\Models\User::where('id', Auth::user()->id)
            ->with('forms')->first();
        return response([
            'user' => $user,
            'access_token' => $token
        ]);

    }

    public function info(Request $request)
    {
        $user = \App\Models\User::where('id', Auth::user()->id)
            ->with('forms')->first();
        return response($user);
    }

}
