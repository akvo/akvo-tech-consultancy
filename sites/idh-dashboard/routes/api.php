<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController as Api;
use App\Http\Controllers\AuthController as Auth;

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

Route::get('/filters', [Api::class, 'filters']);
Route::get('/country-data/{id}/{tab}', [Api::class, 'countryData']);
Route::get('/compare-data/{id}', [Api::class, 'compareData']);

Route::post('/auth/login', [Auth::class,'login']);

Route::get('/user', [Auth::class, 'info'])->middleware('auth:api');