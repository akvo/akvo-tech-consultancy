<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('{type}/{instance_name}/{form_id}','AfricasTalkingController@index');
