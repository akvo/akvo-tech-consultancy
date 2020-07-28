<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Page Routes
|--------------------------------------------------------------------------
|
| Where all the react components need 
|
*/

Route::get('filters', 'Api\PageController@filters');
Route::get('countries', 'Api\PageController@countries');
