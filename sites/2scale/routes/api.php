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
    return response()->json([
        'status' => 'mashook'
    ]);
});

Route::get('/folders', 'FolderController@getFolders');
Route::get('/surveys', 'SurveyController@getSurveys');
Route::get('/survey/{id}', 'SurveyController@getSurvey');
