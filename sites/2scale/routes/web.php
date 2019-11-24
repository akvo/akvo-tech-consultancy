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

Route::get('/', 'PageController@home')->name('home');
Route::get('/data', 'PageController@data')->name('data');
Route::get('/survey', 'PageController@survey')->name('survey');
Route::get('/blank-survey', 'PageController@blank');
