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
//Route::get('/test', 'PageController@test')->name('test');
//Route::get('/db', 'PageController@database')->name('database');
//Route::get('/stats/{page}', 'PageController@stats')->name('stats');
//Route::get('/visualization', 'PageController@visualization')->name('visualization');
Route::get('/demo', 'PageController@demo')->name('demo');
Route::get('/timeline', 'PageController@timeline')->name('timeline');
Route::post('/download', 'PageController@download')->name('download');
//Route::middleware('auth')->group(function() {
//});

Auth::routes();
Route::get('/home', 'HomeController@index')->name('home');
