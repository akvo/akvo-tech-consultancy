<?php
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/


Route::middleware(['auth'])->group(function() {
    Route::get( '/logout', 'Auth\Auth0IndexController@logout' )->name('logout');
    Route::get('/dashboard', 'PageController@dashboard')->name('dashboard');
    Route::get('/database', 'PageController@database')->name('database');
    Route::get('/survey', 'PageController@surveys')->name('surveys');
    Route::get('/survey/{id}', 'PageController@survey')->name('survey');
    Route::get('/organisation', 'PageController@organisation')->name('organisation');
    Route::get('/partnership', 'PageController@partnership')->name('partnership');
    Route::get('/reach-and-react', 'PageController@reachreact')->name('reachreact');
});


Route::get('/', 'PageController@home')->name('home');
Route::get( '/auth0/callback', '\Auth0\Login\Auth0Controller@callback' )->name('auth0-callback');
Route::get( '/login', 'Auth\Auth0IndexController@login' )->name('login');

/*
|--------------------------------------------------------------------------
| Frames
|--------------------------------------------------------------------------
*/

Route::get('/frame-blank', 'FrameController@blank');
Route::get('/frame-undermaintenance', 'FrameController@undermaintenance');
Route::get('/frame-home', 'FrameController@home');
Route::get('/frame-dashboard', 'FrameController@dashboard');
Route::get('/frame-organisation', 'FrameController@organisation');
Route::get('/frame-reachreact', 'FrameController@reachreact');
Route::get('/frame-partnership/{country_id}/{partnership_id}', 'FrameController@partnership');
Route::get('/frame-database/{form_id}', 'FrameController@database');
Route::get('/frame-database/{form_id}/{country}', 'FrameController@database');

