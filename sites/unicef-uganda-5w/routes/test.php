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

Route::get('wash-domain', 'Api\TestController@getTest');
Route::get('domains', 'Api\TestController@getDomains');
Route::get('domain/{domain_id}', 'Api\TestController@getDomain');
Route::get('location/{county}', 'Api\TestController@getLocation');
Route::get('location/{county}/{sub_county}', 'Api\TestController@getLocation');

Route::get('faker/{total}/{repeat}', 'Api\FakerController@seed');
