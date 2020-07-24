<?php

use Illuminate\Http\Request;

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


// V2
Route::get('/source','MapController@getSources');
Route::get('/data/{source}','MapController@getData');
Route::get('/config/{source}','MapController@getConfig');

Route::get('/custom/{survey_id}', 'ApiController@getConfig');
Route::get('/surveys', 'ApiController@getSurveys');
Route::post('/verify','ApiController@getVerification');
// Route::get('/geoshape/{level}', 'ApiController@getGeoShape');