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
| SYNC API
|
*/

Route::get('/sync-survey-forms', 'Api\SyncController@syncSurveyForms');
Route::get('/sync-questions', 'Api\SyncController@syncQuestions');
Route::get('/sync-question-options', 'Api\SyncController@syncQuestionOptions');
Route::get('/sync-partnerships', 'Api\SyncController@syncPartnerships');
Route::get('/sync-datapoints', 'Api\SyncController@syncDataPoints');
Route::get('/testing', 'Api\SyncController@testing');

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

Route::get('/charts/home/workstream','Api\ChartController@workStream');
Route::get('/charts/home/top-three','Api\ChartController@topThree');
Route::get('/charts/home/organisation-forms','Api\ChartController@organisationForms');
Route::get('/charts/home/map','Api\ChartController@mapCharts');
Route::get('/charts/organisation/hierarchy','Api\ChartController@hierarchy');
Route::get('/charts/reachreact/gender', 'Api\ChartController@rnrGender');
Route::get('/charts/reachreact/gender-total', 'Api\ChartController@rnrGenderTotal');
Route::get('/charts/reachreact/country-total', 'Api\ChartController@rnrGenderCountry');
Route::get('/charts/reachreact/top-three','Api\ChartController@topThree');
