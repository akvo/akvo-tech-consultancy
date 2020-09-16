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

Route::get('/', function () {
    return view('index');
});

Route::get('all-countries', 'Api\TestController@allcountries');
Route::get('download', function() {
    return view('download');
});

Route::post('download', 'Api\ReportController@download');

/*
 Translation Docs
 */

Route::get('/trans/values', 'Controller@values');
Route::get('/trans/questions', 'Controller@questions');
Route::get('/trans/countries', 'Controller@countries');
Route::get('/trans/regions', 'Controller@regions');
Route::get('/trans/actions', 'Controller@actions');
