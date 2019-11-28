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

Route::get('/charts-dropdown', 'Api\ChartController@questionList');
Route::get('/chart/{id}', 'Api\ChartController@chartsById');


/*
|
| DATATABLES API 
|
*/

Route::get('/test','Api\DataTableController@getCountries');

Route::get('/datatables/{form_id}','Api\DataTableController@getDataPoints');
Route::get('/datatables/{form_id}/{country}','Api\DataTableController@getDataPoints');
Route::get('/datatables/{form_id}/{country}/{datestart}/{dateend}','Api\DataTableController@getDataPoints');

Route::get('/charts/workstream','Api\ChartController@workStream');
Route::get('/charts/top-three','Api\ChartController@topThree');
Route::get('/charts/organisation-forms','Api\ChartController@organisationForms');
Route::get('/charts/mapcharts','Api\ChartController@mapCharts');
Route::get('/charts/organisation','Api\ChartController@hierarchy');
Route::get('/charts/rnr-gender', 'Api\ChartController@rnrGender');
Route::get('/charts/rnr-gender-total', 'Api\ChartController@rnrGenderTotal');
Route::get('/charts/rnr-country-total', 'Api\ChartController@rnrGenderCountry');
