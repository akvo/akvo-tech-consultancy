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


/*
|--------------------------------------------------------------------------
| Reach and React
|--------------------------------------------------------------------------
*/

Route::get('/reachreact/gender-count/{country_id}/{partnership_id}','Api\ChartController@genderCount');
Route::get('/reachreact/gender/{country_id}/{partnership_id}', 'Api\ChartController@rnrGender');
Route::get('/reachreact/gender-total/{country_id}/{partnership_id}', 'Api\ChartController@genderTotal');
Route::get('/reachreact/country-total/{country_id}/{partnership_id}', 'Api\ChartController@countryTotal');
Route::get('/reachreact/top-three/{country_id}/{partnership_id}','Api\ChartController@topThree');

/*
| Reach and React With Date Filter
*/

Route::get('/reachreact/gender/{country_id}/{partnership_id}/{start}/{end}', 'Api\ChartController@rnrGender');
Route::get('/reachreact/gender-total/{country_id}/{partnership_id}/{start}/{end}', 'Api\ChartController@genderTotal');
Route::get('/reachreact/country-total/{country_id}/{partnership_id}/{start}/{end}', 'Api\ChartController@countryTotal');
Route::get('/reachreact/top-three/{country_id}/{partnership_id}/{start}/{end}','Api\ChartController@topThree');

/*
|--------------------------------------------------------------------------
| Partnership
|--------------------------------------------------------------------------
*/

Route::get('/partnership/top-three/{country_id}/{partnership_id}','Api\ChartController@topThree');
Route::get('/partnership/commodities/{country_id}/{partnership_id}', 'Api\ChartController@partnershipCharts');
Route::get('/partnership/countries-total/{country_id}/{partnership_id}', 'Api\ChartController@partnershipTotalCharts');
Route::get('/partnership/project-total/{country_id}/{partnership_id}', 'Api\ChartController@partnershipCommodityCharts');

/*
| Partnership with date filter 
*/

Route::get('/partnership/top-three/{country_id}/{partnership_id}/{start}/{end}','Api\ChartController@topThree');
Route::get('/partnership/commodities/{country_id}/{partnership_id}/{start}/{end}', 'Api\ChartController@partnershipCharts');
Route::get('/partnership/countries-total/{country_id}/{partnership_id}/{start}/{end}', 'Api\ChartController@partnershipTotalCharts');
Route::get('/partnership/project-total/{country_id}/{partnership_id}/{start}/{end}', 'Api\ChartController@partnershipCommodityCharts');


/**
 * Test
 */

 Route::get('/test/{country_id}/{partnership_id}/{start}/{end}', 'Api\ChartController@test');