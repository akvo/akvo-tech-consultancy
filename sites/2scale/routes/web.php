<?php
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', 'PageController@home')->name('home');
Route::get('/database', 'PageController@database')->name('database');
Route::get('/survey', 'PageController@survey')->name('survey');
Route::get('/organisation', 'PageController@organisation')->name('organisation');
Route::get('/partnership', 'PageController@partnership')->name('partnership');
Route::get('/reach-and-react', 'PageController@reachreact')->name('reachreact');


/*
|--------------------------------------------------------------------------
| Frames 
|--------------------------------------------------------------------------
*/

Route::get('/frame-blank', 'FrameController@blank');
Route::get('/frame-home', 'FrameController@home');
Route::get('/frame-organisation', 'FrameController@organisation');
Route::get('/frame-reachreact', 'FrameController@reachreact');
Route::get('/frame-partnership/{country_id}/{partnership_id}/{form_id}', 'FrameController@partnership');
Route::get('/frame-database/{form_id}', 'FrameController@database');
Route::get('/frame-database/{form_id}/{country}', 'FrameController@database');
