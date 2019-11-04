<?php

use Illuminate\Http\Request;
use App\Libraries\Akvo;

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

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/test', function (Request $request) {
    Akvo::login();
    return response()->json([
        'status' => 'mashook'
    ]);
});

Route::get('/surveys/{id}', 'SurveyController@getSurvey');