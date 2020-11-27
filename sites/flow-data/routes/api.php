<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\CsvController;

Route::get('sources', [ApiController::class, 'sources']);
Route::get('survey/{instanceId}/{surveyId}', [ApiController::class, 'survey']);
Route::get('form-instances/{instanceId}/{surveyId}/{formId}', [ApiController::class, 'formInstances']);
Route::get('form-instances/{instanceId}/{surveyId}/{formId}/{result}', [ApiController::class, 'formInstances']);

Route::get('generate-csv', [CsvController::class, 'generate']);