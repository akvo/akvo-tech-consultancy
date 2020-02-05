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

Route::get('filters', 'Api\PageController@getDropdownFilters');
Route::get('countries', 'Api\PageController@getDropdownCountries');
