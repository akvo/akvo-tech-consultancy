<?php

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

Route::get('/', 'PageController@index')->name('landing');
Route::get('/test', 'PageController@test')->name('test');
Route::get('/database', 'PageController@database')->name('database');
Route::get('/stats/{page}', 'PageController@stats')->name('stats');
