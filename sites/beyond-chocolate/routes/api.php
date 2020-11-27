<?php

use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Http\Controllers\EmailController as Email;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->get('/me', function (Request $request) {
    $user = $request->user();
    $forms = config('example.users');

    $formId = Arr::get($forms, $user->email);
    $formUrl = $formId !== null ? config('example.url').$formId: '';

    return [
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'form' => $formUrl,
        'verified' => $user->hasVerifiedEmail()
    ];
});

Route::middleware(['auth:sanctum', 'verified'])->get('/users', function () {
    return User::all();
});

Route::middleware(['auth:sanctum', 'verified'])->post('/send-email', [Email::class, 'send']);