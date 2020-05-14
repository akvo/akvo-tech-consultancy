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
Route::get('value/domain/{domain_id}', 'Api\TestController@getDomain');
