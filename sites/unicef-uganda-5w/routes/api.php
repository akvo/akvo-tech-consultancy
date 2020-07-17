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

Route::get('/coordinations/{option_id}', 'Api\DataController@getCoordinations');
Route::get('/value/category/{id}', 'Api\QueryController@getValueById');

Route::get('/filters/{type}', 'Api\ApiController@filters');
Route::get('/data', 'Api\ApiController@data');
Route::get('/covid','Api\ApiController@getCovidStatus');
