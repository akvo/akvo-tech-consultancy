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

/*
Route::get('/folders', 'Api\FolderController@getFolders');
Route::get('/surveys', 'Api\SurveyController@getSurveys');
Route::get('/survey/{id}', 'Api\SurveyController@getSurvey');
Route::get('/datapoints', 'Api\DataController@getDataPoint');
Route::get('/forminstances', 'Api\DataController@getFormInstance');
Route::get('/download', 'Api\DataController@downloadCSV');
Route::get('/csv', 'Api\DataController@downloadCSV2');
Route::get('/cron', 'Api\DataController@cron');
 */

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

/*
|
| SEED API
|
*/

Route::get('/seed-datapoints/{survey_group_id}', 'Api\SeedController@seedDataPoint');

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

Route::get('/datatables/{form_id}','Api\DataTableController@getDataPoints');
Route::get('/datatables/{form_id}/{start}/{end}','Api\DataTableController@getDataPoints');
Route::get('/datatables/{form_id}/{country}/{start}/{end}','Api\DataTableController@getDataPoints');


/*
|
| PAGE INTERACTION API
|
*/

Route::get('/partnership/{parent_id}','Api\ConfigController@getPartnership');


// Email
Route::post('/send_email', 'Api\SupportController@send');
