<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController as Api;
use App\Http\Controllers\AuthController as Auth;
use App\Http\Controllers\SeedController as Seed;

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
Route::post('/verify', [Auth::class,'verify']);
Route::post('/download', [Auth::class,'download'])->middleware('auth:api');

Route::post('/auth/register', [Auth::class, 'register']);
Route::post('/auth/forgot-password', [Auth::class, 'forgotPassword']);
Route::post('/auth/new-password', [Auth::class, 'newPassword']);
Route::get('/user', [Auth::class, 'info'])->middleware('auth:api');
Route::post('/logs', [Auth::class,'logs'])->middleware('auth:api');
Route::post('/user/update', [Auth::class, 'update'])->middleware('auth:api');
Route::post('/user/list', [Auth::class, 'list'])->middleware('auth:api');
Route::post('/user/access', [Auth::class, 'access'])->middleware('auth:api');

Route::get('/syncData/{form_id}', [Seed::class, 'seed']);