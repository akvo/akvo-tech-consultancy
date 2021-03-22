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
Route::get('/home/map','Api\ChartController@mapCharts'); # dashboard
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
Route::get('/reachreact/{type}/{country_id}/{partnership_id}','Api\ChartController@foodNutritionAndSecurity');

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
 * Chart for PDF Report
 */
Route::get('/report/reachreact/card/{country_id}/{partnership_id}/{start}/{end}', 'Api\ChartController@reportReactReactCard');
Route::get('/report/{type}/{country_id}/{partnership_id}/{start}/{end}', 'Api\ChartController@reportReachReactBarChart');


/**
 * Home tab (new update)
 */
Route::get('/home/map/partnership', 'Api\ChartController@homePartnershipMapChart'); // Add choropleth map coded by partnership counts
Route::get('/home/sector-distribution', 'Api\ChartController@homeSectorDistribution'); // add visual for sector distribution and partnership distribution
Route::get('/home/partnership-per-country', 'Api\ChartController@homePartnershipDistribution'); // add visual for sector distribution and partnership distribution
Route::get('/home/investment-tracking', 'Api\ChartController@homeInvestmentTracking'); // add investment tracking by 2scale and private contribution against target


/**
 * Reports tab (new update)
 */
Route::get('/report/total-activities', 'Api\ChartController@reportTotalActivities'); // Total number of activities captured filtered by country and partnership


/**
 * RSR
 */
Route::get('/rsr-datatables/{country_id}/{partnership_id}', 'Api\ChartController@getRsrDatatable');
Route::get('/rsr-datatables/uii/{country_id}/{partnership_id}', 'Api\ChartController@getRsrDatatableByUii');