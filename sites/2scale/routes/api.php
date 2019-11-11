<?php

use Illuminate\Http\Request;
use App\Libraries\Akvo;

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

Route::get('/test', function (Request $request) {
    return response()->json([
        'status' => 'mashook'
    ]);
});

Route::get('/folders', 'Api\FolderController@getFolders');
Route::get('/surveys', 'Api\SurveyController@getSurveys');
Route::get('/survey/{id}', 'Api\SurveyController@getSurvey');
Route::get('/datapoints', 'Api\DataController@getDataPoint');
Route::get('/forminstances', 'Api\DataController@getFormInstance');
Route::get('/download', 'Api\DataController@downloadCSV');

Route::get('/csv', 'Api\DataController@downloadCSV2');
Route::get('/cron', 'Api\DataController@cron');

/*
|
| CHARTS API
|
*/

Route::get('/chart/{id}', 'Api\ChartController@questionId');
