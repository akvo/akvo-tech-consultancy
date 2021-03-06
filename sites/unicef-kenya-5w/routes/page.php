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

Route::get('domains', 'Api\PageController@getDomains');
Route::get('locations', 'Api\PageController@getLocations');
Route::get('domain/{domain_id}', 'Api\PageController@getDomain');
Route::get('location/{county}', 'Api\PageController@getLocation');
Route::get('location/{county}/{sub_county}', 'Api\PageController@getLocation');



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

