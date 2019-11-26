<?php
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', 'PageController@home')->name('home');
Route::get('/data', 'PageController@data')->name('data');
Route::get('/survey', 'PageController@survey')->name('survey');


/*
|--------------------------------------------------------------------------
| Frames 
|--------------------------------------------------------------------------
*/

Route::get('/frame-blank', 'FrameController@blank');
Route::get('/frame-datatable/{form_id}', 'FrameController@datatable');
Route::get('/frame-datatable/{form_id}/{country}', 'FrameController@datatable');
