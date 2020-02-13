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


Route::get('groups', 'Api\SourceController@getGroups');
Route::get('countries', 'Api\SourceController@getCountries');
Route::get('values', 'Api\SourceController@getValues');
Route::get('variables', 'Api\SourceController@getVariables');

Route::get('count/country', 'Api\ChartController@getCountryValues');
Route::get('count/values', 'Api\ChartController@getAllValues');

Route::get('value/{id}', 'Api\ChartController@getValueById');

Route::get('test', 'Api\TestController@test');
