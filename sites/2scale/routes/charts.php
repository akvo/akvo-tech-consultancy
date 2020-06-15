<?php

use Illuminate\Http\Request;
use App\Libraries\Akvo;

/*
|--------------------------------------------------------------------------
| Chart Routes
|--------------------------------------------------------------------------
*/

Route::get('/home/workstream','Api\ChartController@workStream');
Route::get('/home/top-three','Api\ChartController@topThree');
Route::get('/home/organisation-forms','Api\ChartController@organisationForms');
Route::get('/home/map','Api\ChartController@mapCharts');
Route::get('/organisation/hierarchy','Api\ChartController@hierarchy');
Route::get('/reachreact/gender-count/{country_id}/{partnership_id}','Api\ChartController@genderCount');
Route::get('/reachreact/gender/{country_id}/{partnership_id}', 'Api\ChartController@rnrGender');
Route::get('/reachreact/gender-total/{country_id}/{partnership_id}', 'Api\ChartController@genderTotal');
Route::get('/reachreact/country-total/{country_id}/{partnership_id}', 'Api\ChartController@countryTotal');
Route::get('/reachreact/top-three/{country_id}/{partnership_id}','Api\ChartController@topThree');

Route::get('/partnership/datapoints','Api\ChartController@totalDatapoints');
Route::get('/partnership/top-three/{country_id}/{partnership_id}','Api\ChartController@topThree');
Route::get('/partnership/commodities/{country_id}/{partnership_id}', 'Api\ChartController@partnershipCharts');
Route::get('/partnership/countries-total/{country_id}/{partnership_id}', 'Api\ChartController@partnershipTotalCharts');
Route::get('/partnership/project-total/{country_id}/{partnership_id}', 'Api\ChartController@partnershipCommodityCharts');
