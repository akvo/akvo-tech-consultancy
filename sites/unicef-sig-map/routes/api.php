<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/params','ApiController@getParams');
Route::get('/locations','ApiController@getLocation');
Route::get('/rgeojson/','ApiController@getGeoRson');
Route::get('/getcountable','ApiController@getCountable');
Route::get('/geojson/','ApiController@getGeoJson');
Route::get('/getcount/{name}','ApiController@getCountIndicator');
Route::get('/getcountall','ApiController@getCountAllIndicators');
Route::get('/transform/','ApiController@transGeoJson');
Route::get('/geofeatures/','ApiController@getGeoFeatures');
Route::get('/province/','ApiController@getProvinces');
Route::get('/school-type/','ApiController@getSchoolType');
Route::get('/details/{id}','ApiController@getDetail');
Route::get('/search/{q}','ApiController@searchData');
Route::post('/database','ApiController@getDataTables');
Route::get('/toilets','ChartsController@getTotalToilet');

// Route::get('/rgeojson/','ApiController@getGeoRson');
