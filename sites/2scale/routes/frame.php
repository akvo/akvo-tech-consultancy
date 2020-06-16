<?php
/*
|--------------------------------------------------------------------------
| Frames
|--------------------------------------------------------------------------
*/

Route::get('/blank', 'FrameController@blank');
Route::get('/undermaintenance', 'FrameController@undermaintenance');
Route::get('/home', 'FrameController@home');
Route::get('/dashboard', 'FrameController@dashboard');
Route::get('/organisation', 'FrameController@organisation');
Route::get('/reachreact/{country_id}/{partnership_id}', 'FrameController@reachreact');
Route::get('/partnership/{country_id}/{partnership_id}', 'FrameController@partnership');
Route::get('/database/{form_id}', 'FrameController@database');
Route::get('/database/{form_id}/{country}', 'FrameController@database');
