<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\Log as Logs;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'email|required',
            'password' => 'required'
        ]);
        if (!Auth::attempt($credentials)) {
            return response([
                'message' => 'Invalid login credentials.',
                'verify' => false
            ], 401);
        }
        Auth::user()->tokens->each(function($token, $key) {
            $token->delete();
        });
        $token = Auth::user()->createToken('authToken')->accessToken;
        $user = \App\Models\User::where('id', Auth::user()->id)
            ->with('forms')->first();
        if (!$user->active) {
            return response([
                'message' => 'Please verify your email before you use your account.',
                'verify' => true
            ], 401);
        }
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

    public function list(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response(['message' => 'session is expired'], 401);
        }
        if ($user->role !== 'user') {
            $users = \App\Models\User::with('forms')->get();
            return $users;
        }
        return response(['message' => 'unathorized'], 401);
    }

    public function access(Request $request)
    {
        $user = \App\Models\User::where('email', $request->email)->first();
        if (!$user) {
            return response(['message' => 'user not found'], 401);
        }
        $userId = $user->id;
        $user->update(['role' => $request->role]);
        if ($request->role !== "Guest") {
            $c = \App\Models\UserForm::where('user_id', $userId)->first();
            if ($c) {
                $c->delete();
            }
        } else {
            $access = collect($request->forms)->whereIn('access', [1,2])->all();
            $access = collect($access)->map(function($data) use ($userId){
                return [
                    'user_id' => $userId,
                    'form_id' => $data['form_id'],
                    'access' => (int) $data['access'] - 1
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
                    'form_id' => $data['form_id']
                ];
            });
            foreach($revoked as $r) {
                $r = \App\Models\UserForm::where('form_id', $r['form_id'])->where('user_id', $r['user_id'])->first();
                if ($r) {
                    $r->delete();
                }
            }
        }
        return [
            'message' => 'Access is Updated'
        ];
    }

    public function download(Request $request, Logs $log)
    {
        $user = Auth::user();
        $log = $log->create([
            'user_id' => $user->id,
            'form_id' => $request->form_id
        ]);
        return $log;
    }

    public function logs(Request $request)
    {
        if (!Auth::user()) {
            return response(['message' => 'session is expired'], 401);
        }
        $logs = \App\Models\Log::with('user')->get();
        $logs = $logs->transform(function($q){
            return [
                'name' => $q->user->name,
                'role' => Str::title($q->user->role),
                'form_id' => $q->form_id,
                'at' => $q->created_at->format("Y-m-d H:i:s")
            ];
        });
        return $logs;
    }
}
