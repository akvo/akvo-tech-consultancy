<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

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

    public function update(Request $request)
    {
        $credentials = $request->validate([
            'password' => 'required',
            'new_password' => 'required'
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
                'message' => 'password has been updated'
            ]);
        };
        return response(['message' => 'invalid password'], 401);
    }

    public function search(Request $request)
    {
        $user = \App\Models\User::where('email', $request->email)->first();
        $access = \App\Models\UserForm::where('user_id', $user->id)->get();
        if (!Auth::user()) {
            return response(['message' => 'session is expired'], 401);
        }
        if (!$user){
            return response(['message' => 'user not found'], 401);
        }
        return response(['message' => 'user is exist', 'access' => $access]);
    }

    public function access(Request $request)
    {
        $user = \App\Models\User::where('email', $request->email)->first();
        if (!$user) {
            return response(['message' => 'user not found'], 401);
        }
        $userId = $user->id;
        $access = collect($request->forms)->whereIn('access', [1,2])->all();
        $access = collect($access)->map(function($data) use ($userId){
            return [
                'user_id' => $userId,
                'form_id' => $data['id'],
                'download' => (int) $data['access'] - 1
            ];
        });
        foreach($access as $a) {
            $c = \App\Models\UserForm::where('form_id', $a['form_id'])->where('user_id', $a['user_id'])->first();
            if ($c) {
                $c->update($a);
            } else {
                \App\Models\UserForm::create($a);
            }
        }
        $revoked = collect($request->forms)->where('access', 0)->all();
        $revoked = collect($revoked)->map(function($data) use ($userId){
            return [
                'user_id' => $userId,
                'form_id' => $data['id']
            ];
        });
        foreach($revoked as $r) {
            $r = \App\Models\UserForm::where('form_id', $r['form_id'])->where('user_id', $r['user_id'])->first();
            if ($r) {
                $r->delete();
            }
        }
        return [
            'message' => 'Access is Updated'
        ];
    }
}
