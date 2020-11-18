<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::get('/surveys', 'Api\ApiController@getSurveys');
Route::get('/data', 'Api\ApiController@data');
Route::get('/maps/{form_id}', 'Api\ApiController@getMaps');
// Route::get('/covid','Api\ApiController@getCovidStatus'); # to delete
// Route::get('/covid/district', 'Api\ApiController@getCovidStatusByDistrict'); # to delete