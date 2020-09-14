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

Route::get('list/questions', 'Api\PublicController@questions');
Route::get('list/values', 'Api\PublicController@values');
Route::get('list/actions', 'Api\PublicController@actions');
Route::get('list/countries', 'Api\PublicController@countries');
Route::get('list/regions', 'Api\PublicController@regions');
