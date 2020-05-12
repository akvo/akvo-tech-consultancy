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

Route::get('/data', 'Api\DataController@index');
Route::get('/data/datapoints', 'Api\DataController@getDataPoints');
Route::get('/cascades', 'Api\DataController@getCascades');
Route::get('/options', 'Api\DataController@getOptions');

Route::get('/coordinations/{option_id}', 'Api\DataController@getCoordinations');

