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


Route::get('data', 'Api\ApiController@data');
Route::get('filters', 'Api\ApiController@filterlist');
Route::get('countries', 'Api\ApiController@countrylist');
Route::get('test', 'Api\ApiController@test');


/*
 * Route to initialize localisation
 */
Route::prefix('list')->group(function () {
    Route::get('questions', 'Api\PublicController@questions');
    Route::get('values', 'Api\PublicController@values');
    Route::get('actions', 'Api\PublicController@actions');
    Route::get('countries', 'Api\PublicController@countries');
    Route::get('regions', 'Api\PublicController@regions');
});

Route::post('send-email', 'Api\SupportController@send');


/**
 * Public API
 */
Route::prefix('public')->group(function () {
    Route::get('questions', 'Api\PublicController@getPublicQuestions');
    Route::get('groups', 'Api\PublicController@getPublicGroups');
    Route::get('countries', 'Api\PublicController@getPublicCountries');
    Route::get('filters', 'Api\PublicController@getPublicFilters');
    Route::get('datapoints', 'Api\PublicController@getPublicDatapoints');
    Route::get('datapoint/{uuid}', 'Api\PublicController@getPublicDatapointByUuid');
});