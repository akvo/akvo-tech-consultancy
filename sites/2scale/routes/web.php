<?php
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', 'PageController@home')->name('home');
Route::get('/data', 'PageController@data')->name('data');
Route::get('/survey', 'PageController@survey')->name('survey');
Route::get('/organisation', 'PageController@organisation')->name('org');
Route::get('/reach-and-react', 'PageController@reachreact')->name('rnr');


/*
|--------------------------------------------------------------------------
| Frames 
|--------------------------------------------------------------------------
*/

Route::get('/frame-blank', 'FrameController@blank');
Route::get('/frame-charts', 'FrameController@charts');
Route::get('/frame-charts-hierarchy', 'FrameController@hierarchy');
Route::get('/frame-charts-rnr', 'FrameController@reachreact');
Route::get('/frame-datatable/{form_id}', 'FrameController@datatable');
Route::get('/frame-datatable/{form_id}/{country}', 'FrameController@datatable');
