<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DataSourceController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/data-source', [DataSourceController::class, 'index']);
Route::get('/data-source/{id}', [DataSourceController::class, 'view']);

Route::get('{path?}', function(){
    return view('index');
})->where('{path}', '^((?!api).)*$')
  ->where('{path}', '^((?!files).)*$')
  ->name('home');

Route::get('/country/{country}/{company}/{tab}', function(){
    return view('index');
})->name('country');

Route::get('/verify/{verifyToken}', function(){
    return view('index');
})->name('verify');
